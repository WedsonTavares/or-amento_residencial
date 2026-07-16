using ControleGastos.Api.Domain;

namespace ControleGastos.Api.DTOs;

/// <summary>
/// Representação de uma transação devolvida pela API. Inclui o nome da pessoa
/// (além do id) para o front-end exibir a listagem sem precisar de uma segunda consulta.
/// </summary>
public class TransacaoDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; } = string.Empty;
}
