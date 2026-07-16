using System.ComponentModel.DataAnnotations;
using ControleGastos.Api.Domain;

namespace ControleGastos.Api.DTOs;

/// <summary>
/// Dados necessários para criar uma transação. As validações de formato ficam
/// aqui (valor positivo, descrição, tipo válido); as regras de negócio que
/// dependem do estado do sistema (pessoa existir, menor de idade) ficam no serviço.
/// </summary>
public class CriarTransacaoDto
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
