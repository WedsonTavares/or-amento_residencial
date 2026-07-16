/**
 * Tipos compartilhados do front-end. Espelham os DTOs expostos pela API,
 * mantendo o contrato entre back-end e front-end explícito e tipado.
 */

/** Natureza da transação (mesmos valores textuais do enum do back-end). */
export type TipoTransacao = 'Despesa' | 'Receita';

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoa {
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  pessoaNome: string;
}

export interface CriarTransacao {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

/** Totais consolidados de uma pessoa. */
export interface TotalPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

/** Resposta completa da consulta de totais (por pessoa + total geral). */
export interface ResumoTotais {
  pessoas: TotalPessoa[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}
