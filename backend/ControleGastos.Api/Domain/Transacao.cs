namespace ControleGastos.Api.Domain;

/// <summary>
/// Movimentação financeira (despesa ou receita) vinculada a uma pessoa.
/// Por regra do desafio, transações só podem ser criadas e listadas
/// (não há edição nem exclusão).
/// </summary>
public class Transacao
{
    /// <summary>Identificador único, gerado automaticamente (GUID).</summary>
    public Guid Id { get; set; }

    /// <summary>Descrição livre do que representa a transação.</summary>
    public string Descricao { get; set; } = string.Empty;

    /// <summary>Valor monetário. Sempre positivo; o sinal é dado pelo <see cref="Tipo"/>.</summary>
    public decimal Valor { get; set; }

    /// <summary>Indica se a transação é despesa ou receita.</summary>
    public TipoTransacao Tipo { get; set; }

    /// <summary>Chave estrangeira para a pessoa dona da transação.</summary>
    public Guid PessoaId { get; set; }

    /// <summary>Propriedade de navegação para a pessoa (usada pelo EF Core).</summary>
    public Pessoa? Pessoa { get; set; }
}
