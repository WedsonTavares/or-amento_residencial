import { api } from './client';
import type { CriarPessoa, Pessoa } from '../types';

/** Chamadas à API do recurso "pessoas". */
export const pessoasApi = {
  listar: () => api.get<Pessoa[]>('/pessoas'),
  criar: (dados: CriarPessoa) => api.post<Pessoa>('/pessoas', dados),
  remover: (id: string) => api.delete(`/pessoas/${id}`),
};
