namespace ControleGastos.Api.Exceptions;

/// <summary>
/// Lançada quando um recurso solicitado não existe (ex.: pessoa inexistente).
/// É traduzida para HTTP 404 pelo <see cref="Infrastructure.GlobalExceptionHandler"/>.
/// </summary>
public class RecursoNaoEncontradoException : Exception
{
    public RecursoNaoEncontradoException(string mensagem) : base(mensagem)
    {
    }
}
