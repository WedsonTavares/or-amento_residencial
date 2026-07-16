namespace ControleGastos.Api.Domain;

/// <summary>
/// Natureza de uma transação financeira.
/// <para>É a regra que define se um valor entra (Receita) ou sai (Despesa)
/// do saldo da pessoa.</para>
/// </summary>
public enum TipoTransacao
{
    /// <summary>Saída de dinheiro (reduz o saldo).</summary>
    Despesa = 1,

    /// <summary>Entrada de dinheiro (aumenta o saldo).</summary>
    Receita = 2
}
