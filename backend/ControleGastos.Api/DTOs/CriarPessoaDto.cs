using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.DTOs;

/// <summary>
/// Dados necessários para criar uma pessoa. As DataAnnotations garantem a
/// validação de entrada automaticamente (o [ApiController] devolve 400 se inválido),
/// evitando que dados inconsistentes cheguem à camada de negócio.
/// </summary>
public class CriarPessoaDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 120 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 130, ErrorMessage = "A idade deve estar entre 0 e 130 anos.")]
    public int Idade { get; set; }
}
