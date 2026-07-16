using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

/// <summary>
/// Contrato do serviço de consulta de totais.
/// </summary>
public interface ITotaisService
{
    /// <summary>
    /// Calcula os totais de receitas, despesas e saldo de cada pessoa,
    /// além do total geral consolidado.
    /// </summary>
    Task<ResumoTotaisDto> ObterAsync();
}
