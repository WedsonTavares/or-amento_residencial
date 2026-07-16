import { ApiError } from '../api/client';

/**
 * Converte qualquer erro capturado em uma mensagem exibível.
 * - ApiError: usa a mensagem já tratada vinda do back-end.
 * - Demais (ex.: falha de rede): mensagem orientando a verificar a API.
 */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError) {
    return erro.message;
  }
  return 'Não foi possível conectar ao servidor. Verifique se a API está em execução.';
}
