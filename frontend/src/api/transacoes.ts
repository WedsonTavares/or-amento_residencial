import { api } from './client';
import type { AtualizarTransacao, CriarTransacao, Transacao } from '../types';

/** Chamadas à API do recurso "transacoes". */
export const transacoesApi = {
  listar: () => api.get<Transacao[]>('/transacoes'),
  criar: (dados: CriarTransacao) => api.post<Transacao>('/transacoes', dados),
  atualizar: (id: string, dados: AtualizarTransacao) =>
    api.put<Transacao>(`/transacoes/${id}`, dados),
};
