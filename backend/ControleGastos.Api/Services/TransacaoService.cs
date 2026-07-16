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
        // Regra 1: a pessoa informada precisa existir no cadastro.
        var pessoa = await _db.Pessoas.FindAsync(dto.PessoaId)
            ?? throw new RecursoNaoEncontradoException(
                $"Pessoa com id '{dto.PessoaId}' não encontrada.");

        // Regra 2: menor de idade (< 18 anos) só pode registrar despesas.
        if (pessoa.EhMenorDeIdade && dto.Tipo == TipoTransacao.Receita)
        {
            throw new RegraDeNegocioException(
                "Pessoas menores de 18 anos só podem registrar despesas.");
        }

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

        return new TransacaoDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        };
    }
}
