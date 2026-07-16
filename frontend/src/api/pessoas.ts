import { api } from './client';
import type { AtualizarPessoa, CriarPessoa, Pessoa } from '../types';

/** Chamadas à API do recurso "pessoas". */
export const pessoasApi = {
  listar: () => api.get<Pessoa[]>('/pessoas'),
  criar: (dados: CriarPessoa) => api.post<Pessoa>('/pessoas', dados),
  atualizar: (id: string, dados: AtualizarPessoa) => api.put<Pessoa>(`/pessoas/${id}`, dados),
  remover: (id: string) => api.delete(`/pessoas/${id}`),
};
