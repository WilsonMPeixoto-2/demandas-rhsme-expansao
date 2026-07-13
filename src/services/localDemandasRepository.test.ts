import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initialDemandas } from '../data/initialDemandas';
import type { ComentarioHistorico, Demanda } from '../types';
import { LocalDemandasRepository } from './localDemandasRepository';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  keys(): string[] {
    return [...this.values.keys()];
  }
}

const novaDemanda: Omit<Demanda, 'id'> = {
  numero: 'SME-PRO-2026/99999',
  tipo: 'Processo',
  assunto: 'Nova demanda',
  responsavel: 'Equipe CTRH',
  limite1: '',
  limite2: '30/06/2026',
  status: 'Aguardando Andamento',
  setor: 'E/CTRH',
  classificacao: 'Diversos',
};

function makeHistory(demandas: Demanda[], comentario = 'Histórico preservado'): ComentarioHistorico[] {
  return demandas.map((demanda) => ({
    id: demanda.id,
    demandaId: demanda.id,
    data_hora: '01/01/2026, 10:00:00',
    status_novo: demanda.status,
    setor: demanda.setor,
    comentario,
  }));
}

describe('LocalDemandasRepository', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-12T12:00:00-03:00'));
    storage = new MemoryStorage();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicializa as chaves atuais com demandas e histórico na ordem original', async () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);

    const data = await repository.load();

    expect(data.demandas).toEqual(initialDemandas);
    expect(data.historico.map((item) => item.demandaId)).toEqual(
      initialDemandas.map((demanda) => demanda.id),
    );
    expect(data.historico.every(
      (item) => item.comentario === 'Demanda importada da planilha inicial.',
    )).toBe(true);
    expect(JSON.parse(storage.getItem('demandas_data')!)).toEqual(initialDemandas);
    expect(JSON.parse(storage.getItem('demandas_history')!)).toEqual(data.historico);
    expect(storage.keys()).toEqual(['demandas_data', 'demandas_history']);
  });

  it('preserva coleções armazenadas válidas independente da quantidade de itens', async () => {
    const storedDemandas = initialDemandas.slice(0, 5);
    const storedHistorico = makeHistory(storedDemandas);
    storage.setItem('demandas_data', JSON.stringify(storedDemandas));
    storage.setItem('demandas_history', JSON.stringify(storedHistorico));
    const repository = new LocalDemandasRepository(storage, initialDemandas);

    const data = await repository.load();

    expect(data.demandas).toEqual(storedDemandas);
    expect(data.historico).toEqual(storedHistorico);
  });

  it('redefine para fallback se os dados locais estiverem corrompidos (JSON inválido)', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    storage.setItem('demandas_data', '{invalid json}');
    storage.setItem('demandas_history', '{invalid json}');
    const repository = new LocalDemandasRepository(storage, initialDemandas);

    const data = await repository.load();

    expect(data.demandas).toEqual(initialDemandas);
    expect(alertMock).toHaveBeenCalledTimes(2);
    
    alertMock.mockRestore();
  });

  it('preserva as chaves atuais e cria histórico junto com a demanda', async () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);
    await repository.load();

    await repository.create(novaDemanda);

    const demandas = JSON.parse(storage.getItem('demandas_data')!) as Demanda[];
    const historico = JSON.parse(storage.getItem('demandas_history')!) as ComentarioHistorico[];
    expect(demandas[0]).toMatchObject({ id: 51, numero: novaDemanda.numero });
    expect(demandas[1]).toEqual(initialDemandas[0]);
    expect(historico[0]).toMatchObject({
      demandaId: 51,
      comentario: 'Demanda cadastrada no sistema.',
      status_novo: novaDemanda.status,
      setor: novaDemanda.setor,
    });
    expect(historico[1].demandaId).toBe(initialDemandas[0].id);
  });

  it('edita a demanda no lugar sem alterar a ordem nem o histórico', async () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);
    await repository.load();
    const historyBefore = storage.getItem('demandas_history');

    await repository.update(initialDemandas[1].id, {
      assunto: 'Assunto atualizado',
      responsavel: 'Nova responsável',
    });

    const demandas = JSON.parse(storage.getItem('demandas_data')!) as Demanda[];
    expect(demandas.map((demanda) => demanda.id)).toEqual(
      initialDemandas.map((demanda) => demanda.id),
    );
    expect(demandas[1]).toMatchObject({
      assunto: 'Assunto atualizado',
      responsavel: 'Nova responsável',
    });
    expect(storage.getItem('demandas_history')).toBe(historyBefore);
  });

  it('atualiza o status no lugar e inclui o comentário no início do histórico', async () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);
    await repository.load();
    const target = initialDemandas[2];

    await repository.updateStatus(target.id, 'Encerrado', 'Providência concluída.');

    const data = await repository.load();
    expect(data.demandas[2]).toMatchObject({ id: target.id, status: 'Encerrado' });
    expect(data.historico[0]).toMatchObject({
      demandaId: target.id,
      status_novo: 'Encerrado',
      setor: target.setor,
      comentario: 'Providência concluída.',
    });
    expect(data.historico[1].demandaId).toBe(initialDemandas[0].id);
  });

  it('exclui a demanda e todo o histórico associado sem reordenar os demais', async () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);
    await repository.load();
    const targetId = initialDemandas[1].id;

    await repository.delete(targetId);

    const demandas = JSON.parse(storage.getItem('demandas_data')!) as Demanda[];
    const historico = JSON.parse(storage.getItem('demandas_history')!) as ComentarioHistorico[];
    expect(demandas.map((demanda) => demanda.id)).toEqual(
      initialDemandas.filter((demanda) => demanda.id !== targetId).map((demanda) => demanda.id),
    );
    expect(historico.some((item) => item.demandaId === targetId)).toBe(false);
  });

  it('não cria assinatura remota no modo local', () => {
    const repository = new LocalDemandasRepository(storage, initialDemandas);
    const onRemoteChange = vi.fn();

    const unsubscribe = repository.subscribe(onRemoteChange);
    unsubscribe();

    expect(onRemoteChange).not.toHaveBeenCalled();
  });
});
