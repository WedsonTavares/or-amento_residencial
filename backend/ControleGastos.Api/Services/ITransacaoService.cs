using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

/// <summary>
/// Contrato do serviço de transações. O desafio original exigia apenas
/// criação e listagem; a atualização foi adicionada como recurso extra,
/// reaplicando as mesmas regras de negócio da criação.
/// </summary>
public interface ITransacaoService
{
    /// <summary>Lista todas as transações cadastradas, com o nome da pessoa.</summary>
    Task<IReadOnlyList<TransacaoDto>> ListarAsync();

    /// <summary>
    /// Cria uma transação após validar as regras de negócio:
    /// a pessoa precisa existir e, se for menor de idade, só pode registrar despesas.
    /// </summary>
    Task<TransacaoDto> CriarAsync(CriarTransacaoDto dto);

    /// <summary>
    /// Atualiza uma transação existente, revalidando as mesmas regras de
    /// negócio da criação. Lança <see cref="Exceptions.RecursoNaoEncontradoException"/>
    /// se a transação ou a pessoa não existirem.
    /// </summary>
    Task<TransacaoDto> AtualizarAsync(Guid id, AtualizarTransacaoDto dto);
}
