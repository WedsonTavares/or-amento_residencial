using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoints REST para o cadastro de transações. O desafio original exigia
/// apenas criação e listagem; a atualização foi adicionada como recurso
/// extra, sem exclusão (não solicitada e fora do escopo original).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>Lista todas as transações cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TransacaoDto>>> Listar()
    {
        var transacoes = await _transacaoService.ListarAsync();
        return Ok(transacoes);
    }

    /// <summary>
    /// Cadastra uma nova transação. As regras de negócio (pessoa existir e
    /// menor de idade só registrar despesa) são validadas no serviço e, se
    /// violadas, retornam 400/404 via tratamento global de exceções.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransacaoDto>> Criar([FromBody] CriarTransacaoDto dto)
    {
        var transacao = await _transacaoService.CriarAsync(dto);
        return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, transacao);
    }

    /// <summary>
    /// Atualiza uma transação existente. As regras de negócio são
    /// revalidadas exatamente como na criação (pessoa existir; menor de
    /// idade só registrar despesa).
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TransacaoDto>> Atualizar(Guid id, [FromBody] AtualizarTransacaoDto dto)
    {
        var transacao = await _transacaoService.AtualizarAsync(id, dto);
        return Ok(transacao);
    }
}
