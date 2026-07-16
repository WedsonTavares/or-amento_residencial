using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.DTOs;

/// <summary>
/// Dados para atualizar o nome e a idade de uma pessoa existente.
/// Recurso adicional ao desafio original (que exigia apenas criação, exclusão
/// e listagem) — usa as mesmas validações do cadastro.
/// </summary>
public class AtualizarPessoaDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(120, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 120 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 130, ErrorMessage = "A idade deve estar entre 0 e 130 anos.")]
    public int Idade { get; set; }
}
