namespace ControleGastos.Api.DTOs;

/// <summary>
/// Totais financeiros consolidados de uma pessoa, usados na consulta de totais.
/// </summary>
public class TotalPessoaDto
{
    public Guid PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;

    /// <summary>Soma de todas as receitas da pessoa.</summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>Soma de todas as despesas da pessoa.</summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>Saldo individual = receitas - despesas.</summary>
    public decimal Saldo { get; set; }
}
