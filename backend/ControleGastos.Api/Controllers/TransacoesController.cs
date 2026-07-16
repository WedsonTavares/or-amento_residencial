using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoints REST para o cadastro de transações. Conforme o desafio, expõe
/// apenas criação e listagem (sem edição/exclusão).
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
}
