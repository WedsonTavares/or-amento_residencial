import { API_URL } from '../config';

/**
 * Erro de API com a mensagem já tratada para exibição ao usuário.
 * A mensagem é extraída do corpo ProblemDetails devolvido pelo back-end.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Wrapper mínimo sobre o fetch: injeta a URL base e o header JSON, e converte
 * respostas de erro em ApiError com mensagem amigável. Centralizar isso evita
 * repetir tratamento de resposta em cada chamada.
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!resposta.ok) {
    throw new ApiError(await extrairMensagemErro(resposta), resposta.status);
  }

  // 204 No Content (ex.: DELETE) não possui corpo para desserializar.
  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}

/** Extrai a mensagem mais útil do corpo de erro (ProblemDetails). */
async function extrairMensagemErro(resposta: Response): Promise<string> {
  try {
    const corpo = await resposta.json();

    // Erros de validação do ModelState vêm em { errors: { campo: [msgs] } }.
    if (corpo?.errors) {
      const mensagens = Object.values(corpo.errors).flat() as string[];
      if (mensagens.length > 0) {
        return mensagens.join(' ');
      }
    }

    // Erros de negócio/domínio vêm em { title }.
    if (corpo?.title) {
      return corpo.title as string;
    }
  } catch {
    // Corpo vazio ou não-JSON: usa o fallback abaixo.
  }

  return 'Ocorreu um erro ao processar a solicitação.';
}

/** API HTTP tipada usada pelos módulos de cada recurso. */
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
