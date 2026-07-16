using System.ComponentModel.DataAnnotations;
using ControleGastos.Api.Domain;

namespace ControleGastos.Api.DTOs;

/// <summary>
/// Dados para atualizar uma transação existente. Recurso adicional ao desafio
/// original (que dispensava edição de transações). As mesmas regras de
/// negócio da criação, pessoa existir e menor de idade só registrar despesa,
/// são reaplicadas integralmente na atualização.
/// </summary>
public class AtualizarTransacaoDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "A descrição deve ter até 200 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório.")]
    [EnumDataType(typeof(TipoTransacao), ErrorMessage = "Tipo inválido. Use 'Despesa' ou 'Receita'.")]
    public TipoTransacao Tipo { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória.")]
    public Guid PessoaId { get; set; }
}
