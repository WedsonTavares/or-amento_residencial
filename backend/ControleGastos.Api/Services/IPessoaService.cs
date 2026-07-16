using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

/// <summary>
/// Contrato do serviço de pessoas. Os controllers dependem desta abstração,
/// não da implementação concreta, favorecendo testes e baixo acoplamento.
/// </summary>
public interface IPessoaService
{
    /// <summary>Lista todas as pessoas cadastradas, ordenadas por nome.</summary>
    Task<IReadOnlyList<PessoaDto>> ListarAsync();

    /// <summary>Cria uma nova pessoa e devolve seus dados já com o id gerado.</summary>
    Task<PessoaDto> CriarAsync(CriarPessoaDto dto);

    /// <summary>
    /// Atualiza o nome e a idade de uma pessoa existente. Recurso adicional
    /// ao desafio original. Lança <see cref="Exceptions.RecursoNaoEncontradoException"/>
    /// se o id não existir.
    /// </summary>
    Task<PessoaDto> AtualizarAsync(Guid id, AtualizarPessoaDto dto);

    /// <summary>
    /// Remove a pessoa e, em cascata, todas as suas transações.
    /// Lança <see cref="Exceptions.RecursoNaoEncontradoException"/> se o id não existir.
    /// </summary>
    Task RemoverAsync(Guid id);
}
