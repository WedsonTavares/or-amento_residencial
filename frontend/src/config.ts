/**
 * Configuração central do front-end.
 * A URL base da API pode ser sobrescrita por variável de ambiente do Vite
 * (VITE_API_URL). O valor padrão aponta para a API em desenvolvimento.
 */
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5087/api';
