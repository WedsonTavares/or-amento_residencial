using ControleGastos.Api.Data;
using ControleGastos.Api.Domain;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

/// <summary>
/// Regras e operações de persistência relacionadas a transações.
/// Concentra as duas regras de negócio críticas do cadastro de transações.
/// </summary>
public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _db;

    public TransacaoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<TransacaoDto>> ListarAsync()
    {
        return await _db.Transacoes
            .AsNoTracking()
            .OrderBy(t => t.Pessoa!.Nome)
            .ThenBy(t => t.Descricao)
            .Select(t => new TransacaoDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa!.Nome
            })
            .ToListAsync();
    }

    public async Task<TransacaoDto> CriarAsync(CriarTransacaoDto dto)
    {
        var pessoa = await ValidarRegrasDeNegocioAsync(dto.PessoaId, dto.Tipo);

        var transacao = new Transacao
        {
            Id = Guid.NewGuid(),           // identificador único gerado automaticamente
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = pessoa.Id
        };

        _db.Transacoes.Add(transacao);
        await _db.SaveChangesAsync();

        return MapearParaDto(transacao, pessoa);
    }

    public async Task<TransacaoDto> AtualizarAsync(Guid id, AtualizarTransacaoDto dto)
    {
        var transacao = await _db.Transacoes.FindAsync(id)
            ?? throw new RecursoNaoEncontradoException($"Transação com id '{id}' não encontrada.");

        // Reaplica as mesmas regras de negócio da criação, mesmo que a
        // pessoa vinculada tenha sido trocada na edição.
        var pessoa = await ValidarRegrasDeNegocioAsync(dto.PessoaId, dto.Tipo);

        transacao.Descricao = dto.Descricao.Trim();
        transacao.Valor = dto.Valor;
        transacao.Tipo = dto.Tipo;
        transacao.PessoaId = pessoa.Id;

        await _db.SaveChangesAsync();

        return MapearParaDto(transacao, pessoa);
    }

    /// <summary>
    /// Valida as regras de negócio comuns à criação e à atualização:
    /// a pessoa precisa existir e, se for menor de idade, o tipo não pode ser receita.
    /// </summary>
    private async Task<Pessoa> ValidarRegrasDeNegocioAsync(Guid pessoaId, TipoTransacao tipo)
    {
        var pessoa = await _db.Pessoas.FindAsync(pessoaId)
            ?? throw new RecursoNaoEncontradoException(
                $"Pessoa com id '{pessoaId}' não encontrada.");

        if (pessoa.EhMenorDeIdade && tipo == TipoTransacao.Receita)
        {
            throw new RegraDeNegocioException(
                "Pessoas menores de 18 anos só podem registrar despesas.");
        }

        return pessoa;
    }

    private static TransacaoDto MapearParaDto(Transacao transacao, Pessoa pessoa) => new()
    {
        Id = transacao.Id,
        Descricao = transacao.Descricao,
        Valor = transacao.Valor,
        Tipo = transacao.Tipo,
        PessoaId = transacao.PessoaId,
        PessoaNome = pessoa.Nome
    };
}
