using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoints REST para o cadastro de pessoas (criação, listagem, atualização
/// e exclusão). A atualização é um recurso adicional ao desafio original.
/// O controller é fino: apenas recebe a requisição, delega ao serviço e devolve
/// o status HTTP adequado. As validações de entrada rodam automaticamente
/// graças ao atributo [ApiController].
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>Lista todas as pessoas cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PessoaDto>>> Listar()
    {
        var pessoas = await _pessoaService.ListarAsync();
        return Ok(pessoas);
    }

    /// <summary>Cadastra uma nova pessoa.</summary>
    [HttpPost]
    public async Task<ActionResult<PessoaDto>> Criar([FromBody] CriarPessoaDto dto)
    {
        var pessoa = await _pessoaService.CriarAsync(dto);
        // 201 Created + rota de consulta da coleção, seguindo o padrão REST.
        return CreatedAtAction(nameof(Listar), new { id = pessoa.Id }, pessoa);
    }

    /// <summary>Atualiza o nome e a idade de uma pessoa existente.</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PessoaDto>> Atualizar(Guid id, [FromBody] AtualizarPessoaDto dto)
    {
        var pessoa = await _pessoaService.AtualizarAsync(id, dto);
        return Ok(pessoa);
    }

    /// <summary>Remove uma pessoa e, em cascata, todas as suas transações.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remover(Guid id)
    {
        await _pessoaService.RemoverAsync(id);
        return NoContent(); // 204: sucesso sem corpo de resposta.
    }
}
