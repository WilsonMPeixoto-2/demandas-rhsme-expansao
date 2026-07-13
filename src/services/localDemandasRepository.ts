import type { ComentarioHistorico, Demanda } from '../types';
import type { AppData, DemandasRepository } from './contracts';

const DEMANDAS_KEY = 'demandas_data';
const HISTORY_KEY = 'demandas_history';

export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem'>;

export class LocalDemandasRepository implements DemandasRepository {
  private demandas: Demanda[] = [];
  private historico: ComentarioHistorico[] = [];

  constructor(
    private readonly storage: StorageAdapter,
    private readonly initialDemandas: Demanda[],
  ) {}

  private isValidDemandaArray(arr: any): arr is Demanda[] {
    if (!Array.isArray(arr)) return false;
    return arr.every(d => 
      d && 
      typeof d.id === 'number' && 
      typeof d.numero === 'string' && d.numero.trim() !== '' &&
      typeof d.tipo === 'string' &&
      typeof d.assunto === 'string' &&
      typeof d.status === 'string'
    );
  }

  private isValidHistoryArray(arr: any): arr is ComentarioHistorico[] {
    if (!Array.isArray(arr)) return false;
    return arr.every(h => 
      h && 
      typeof h.id === 'number' && 
      typeof h.demandaId === 'number' &&
      typeof h.status_novo === 'string' &&
      typeof h.comentario === 'string'
    );
  }

  async load(): Promise<AppData> {
    const rawDemandas = this.storage.getItem(DEMANDAS_KEY);
    const rawHistorico = this.storage.getItem(HISTORY_KEY);

    let parsedDemandas: Demanda[] | null = null;
    let parsedHistorico: ComentarioHistorico[] | null = null;
    let houveErroParse = false;

    if (rawDemandas !== null && rawHistorico !== null) {
      const storedDemandas = this.read<any[]>(DEMANDAS_KEY);
      const storedHistorico = this.read<any[]>(HISTORY_KEY);

      if (storedDemandas === null || storedHistorico === null) {
        houveErroParse = true;
      }

      if (this.isValidDemandaArray(storedDemandas) && this.isValidHistoryArray(storedHistorico)) {
        const demandaIds = new Set(storedDemandas.map(d => d.id));
        const consistentHistorico = storedHistorico.filter(h => demandaIds.has(h.demandaId));
        
        parsedDemandas = storedDemandas;
        parsedHistorico = consistentHistorico;
      }
    }

    if (parsedDemandas && parsedHistorico) {
      this.demandas = parsedDemandas;
      this.historico = parsedHistorico;
    } else {
      if ((rawDemandas !== null || rawHistorico !== null) && !houveErroParse) {
        alert("A base de dados local estava inconsistente ou corrompida. Todos os dados foram redefinidos para os valores padrões de segurança.");
      }
      this.demandas = this.initialDemandas.map((demanda) => ({ ...demanda }));
      this.saveDemandas();
      this.resetHistoricoFallback();
    }

    return {
      demandas: this.demandas,
      historico: this.historico,
    };
  }

  private resetHistoricoFallback(): void {
    const hojeStr = new Date().toLocaleString('pt-BR');
    this.historico = this.demandas.map((demanda) => ({
      id: demanda.id,
      demandaId: demanda.id,
      data_hora: hojeStr,
      status_novo: demanda.status,
      setor: demanda.setor || 'SME',
      comentario: 'Demanda importada da planilha inicial.',
    }));
    this.saveHistorico();
  }

  async create(input: Omit<Demanda, 'id'>): Promise<void> {
    if (this.demandas.some(d => d.numero.trim().toLowerCase() === input.numero.trim().toLowerCase())) {
      throw new Error('Já existe uma demanda cadastrada com este número de processo.');
    }

    const id = this.demandas.length > 0
      ? Math.max(...this.demandas.map((demanda) => demanda.id)) + 1
      : 1;
    const demanda: Demanda = { id, ...input };

    this.demandas = [demanda, ...this.demandas];
    this.saveDemandas();

    const comentario: ComentarioHistorico = {
      id: Date.now(),
      demandaId: id,
      data_hora: new Date().toLocaleString('pt-BR'),
      status_novo: input.status,
      setor: input.setor,
      comentario: 'Demanda cadastrada no sistema.',
    };
    this.historico = [comentario, ...this.historico];
    this.saveHistorico();
  }

  async update(id: number, changes: Partial<Demanda>): Promise<void> {
    const exists = this.demandas.some(d => d.id === id);
    if (!exists) throw new Error('Demanda não encontrada.');

    this.demandas = this.demandas.map((demanda) =>
      demanda.id === id ? { ...demanda, ...changes } : demanda,
    );
    this.saveDemandas();
  }

  async updateStatus(
    id: number,
    status: Demanda['status'],
    comentario: string,
  ): Promise<void> {
    const demanda = this.demandas.find((item) => item.id === id);
    if (!demanda) throw new Error('Demanda não encontrada.');

    this.demandas = this.demandas.map((item) =>
      item.id === id ? { ...item, status } : item,
    );
    this.saveDemandas();

    const historico: ComentarioHistorico = {
      id: Date.now(),
      demandaId: id,
      data_hora: new Date().toLocaleString('pt-BR'),
      status_novo: status,
      setor: demanda.setor || '—',
      comentario,
    };
    this.historico = [historico, ...this.historico];
    this.saveHistorico();
  }

  async delete(id: number): Promise<void> {
    this.demandas = this.demandas.filter((demanda) => demanda.id !== id);
    this.historico = this.historico.filter((item) => item.demandaId !== id);
    this.saveDemandas();
    this.saveHistorico();
  }

  subscribe(_onRemoteChange: () => void): () => void {
    return () => undefined;
  }

  private read<T>(key: string): T | null {
    const value = this.storage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      alert(`Os dados locais de "${key}" estavam corrompidos e foram redefinidos para os valores padrões.`);
      return null;
    }
  }

  private saveDemandas(): void {
    this.storage.setItem(DEMANDAS_KEY, JSON.stringify(this.demandas));
  }

  private saveHistorico(): void {
    this.storage.setItem(HISTORY_KEY, JSON.stringify(this.historico));
  }
}
