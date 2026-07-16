namespace ControleGastos.Api.DTOs;

/// <summary>
/// Resultado completo da consulta de totais: os totais por pessoa mais o
/// total geral consolidado de todas elas (exigido pelo desafio).
/// </summary>
public class ResumoTotaisDto
{
    /// <summary>Totais individuais de cada pessoa cadastrada.</summary>
    public IReadOnlyList<TotalPessoaDto> Pessoas { get; set; } = [];

    /// <summary>Soma das receitas de todas as pessoas.</summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>Soma das despesas de todas as pessoas.</summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>Saldo líquido geral = total de receitas - total de despesas.</summary>
    public decimal SaldoLiquido { get; set; }
}
