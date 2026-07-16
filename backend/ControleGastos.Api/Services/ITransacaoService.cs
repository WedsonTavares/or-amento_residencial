using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

/// <summary>
/// Contrato do serviço de transações (apenas criação e listagem, conforme o desafio).
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
}
