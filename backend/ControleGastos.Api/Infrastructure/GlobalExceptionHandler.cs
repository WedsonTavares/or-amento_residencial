using ControleGastos.Api.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Infrastructure;

/// <summary>
/// Tratamento centralizado de exceções. Converte exceções de domínio em respostas
/// HTTP padronizadas (<see cref="ProblemDetails"/>), evitando blocos try/catch
/// repetidos nos controllers e garantindo um contrato de erro consistente.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // Mapeia cada tipo de exceção para o status HTTP adequado.
        // Exceções não previstas viram 500 sem vazar detalhes internos.
        var (statusCode, titulo) = exception switch
        {
            RecursoNaoEncontradoException => (StatusCodes.Status404NotFound, exception.Message),
            RegraDeNegocioException => (StatusCodes.Status400BadRequest, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Ocorreu um erro inesperado no servidor.")
        };

        // Erros inesperados (500) são registrados para diagnóstico.
        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Erro não tratado ao processar a requisição.");
        }

        var problema = new ProblemDetails
        {
            Status = statusCode,
            Title = titulo
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problema, cancellationToken);

        return true; // exceção tratada; interrompe a propagação.
    }
}
