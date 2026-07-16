namespace ControleGastos.Api.Exceptions;

/// <summary>
/// Lançada quando uma regra de negócio é violada
/// (ex.: menor de idade tentando registrar receita).
/// É traduzida para HTTP 400 pelo <see cref="Infrastructure.GlobalExceptionHandler"/>.
/// </summary>
public class RegraDeNegocioException : Exception
{
    public RegraDeNegocioException(string mensagem) : base(mensagem)
    {
    }
}
