namespace ControleGastos.Api.Domain;

/// <summary>
/// Pessoa cadastrada no sistema. É a "dona" das transações: ao ser removida,
/// todas as suas transações são apagadas em cascata (ver AppDbContext).
/// </summary>
public class Pessoa
{
    /// <summary>Identificador único, gerado automaticamente (GUID).</summary>
    public Guid Id { get; set; }

    /// <summary>Nome da pessoa.</summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>Idade em anos. Usada para a regra do menor de idade.</summary>
    public int Idade { get; set; }

    /// <summary>
    /// Transações associadas à pessoa. Propriedade de navegação usada pelo
    /// EF Core para configurar o relacionamento 1:N e a exclusão em cascata.
    /// </summary>
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();

    /// <summary>
    /// Regra de domínio: considera-se menor quem tem menos de 18 anos.
    /// Centralizada aqui para não repetir o número "mágico" pelo código.
    /// </summary>
    public bool EhMenorDeIdade => Idade < 18;
}
