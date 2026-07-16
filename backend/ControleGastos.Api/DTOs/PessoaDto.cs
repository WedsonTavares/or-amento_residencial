namespace ControleGastos.Api.DTOs;

/// <summary>
/// Representação de uma pessoa devolvida pela API. Usar um DTO em vez da entidade
/// evita expor detalhes internos (como a coleção de transações) e mantém o
/// contrato da API estável.
/// </summary>
public class PessoaDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}
