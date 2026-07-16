using ControleGastos.Api.Data;
using ControleGastos.Api.Domain;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

/// <summary>
/// Regras e operações de persistência relacionadas a pessoas.
/// </summary>
public class PessoaService : IPessoaService
{
    private readonly AppDbContext _db;

    public PessoaService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<PessoaDto>> ListarAsync()
    {
        // Projeta direto para DTO na consulta (não traz a coleção de transações),
        // deixando a query eficiente e a resposta enxuta.
        return await _db.Pessoas
            .AsNoTracking()
            .OrderBy(p => p.Nome)
            .Select(p => new PessoaDto
            {
                Id = p.Id,
                Nome = p.Nome,
                Idade = p.Idade
            })
            .ToListAsync();
    }

    public async Task<PessoaDto> CriarAsync(CriarPessoaDto dto)
    {
        var pessoa = new Pessoa
        {
            Id = Guid.NewGuid(),          // identificador único gerado automaticamente
            Nome = dto.Nome.Trim(),        // remove espaços acidentais nas pontas
            Idade = dto.Idade
        };

        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();

        return new PessoaDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };
    }

    public async Task RemoverAsync(Guid id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id)
            ?? throw new RecursoNaoEncontradoException($"Pessoa com id '{id}' não encontrada.");

        // A exclusão em cascata das transações é garantida pela configuração
        // do relacionamento no AppDbContext (DeleteBehavior.Cascade).
        _db.Pessoas.Remove(pessoa);
        await _db.SaveChangesAsync();
    }
}
