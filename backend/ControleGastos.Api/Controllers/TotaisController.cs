using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoint REST para a consulta de totais: totais por pessoa + total geral.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly ITotaisService _totaisService;

    public TotaisController(ITotaisService totaisService)
    {
        _totaisService = totaisService;
    }

    /// <summary>Retorna o resumo consolidado de receitas, despesas e saldos.</summary>
    [HttpGet]
    public async Task<ActionResult<ResumoTotaisDto>> Obter()
    {
        var resumo = await _totaisService.ObterAsync();
        return Ok(resumo);
    }
}
