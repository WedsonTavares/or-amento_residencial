import { api } from './client';
import type { ResumoTotais } from '../types';

/** Chamada à API da consulta de totais. */
export const totaisApi = {
  obter: () => api.get<ResumoTotais>('/totais'),
};
