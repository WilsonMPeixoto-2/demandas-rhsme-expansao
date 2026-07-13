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

  async load(): Promise<AppData> {
    const rawDemandas = this.storage.getItem(DEMANDAS_KEY);
    if (rawDemandas !== null) {
      const storedDemandas = this.read<Demanda[]>(DEMANDAS_KEY);
      this.demandas = storedDemandas ?? this.initialDemandas.map((demanda) => ({ ...demanda }));
      if (!storedDemandas) {
        this.saveDemandas();
      }
    } else {
      this.demandas = this.initialDemandas.map((demanda) => ({ ...demanda }));
      this.saveDemandas();
    }

    const rawHistorico = this.storage.getItem(HISTORY_KEY);
    if (rawHistorico !== null) {
      const storedHistorico = this.read<ComentarioHistorico[]>(HISTORY_KEY);
      if (storedHistorico) {
        this.historico = storedHistorico;
      } else {
        this.resetHistoricoFallback();
      }
    } else {
      this.resetHistoricoFallback();
    }

    return {
      demandas: this.demandas,
      historico: this.historico,
    };
  }

  private resetHistoricoFallback(): void {
    const hojeStr = new Date().toLocaleString('pt-BR');
    this.historico = this.initialDemandas.map((demanda) => ({
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
    this.demandas = this.demandas.map((item) =>
      item.id === id ? { ...item, status } : item,
    );
    this.saveDemandas();

    const historico: ComentarioHistorico = {
      id: Date.now(),
      demandaId: id,
      data_hora: new Date().toLocaleString('pt-BR'),
      status_novo: status,
      setor: demanda?.setor || '—',
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
