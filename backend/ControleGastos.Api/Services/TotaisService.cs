using ControleGastos.Api.Data;
using ControleGastos.Api.Domain;
using ControleGastos.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

/// <summary>
/// Serviço responsável por consolidar os totais financeiros do sistema.
/// </summary>
public class TotaisService : ITotaisService
{
    private readonly AppDbContext _db;

    public TotaisService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ResumoTotaisDto> ObterAsync()
    {
        // Carrega as pessoas com suas transações. A soma de valores (decimal) é
        // feita em memória de propósito: o provider do SQLite tem suporte limitado
        // a agregações de decimal, e a quantidade de dados deste sistema é pequena.
        var pessoas = await _db.Pessoas
            .AsNoTracking()
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        var totaisPorPessoa = pessoas
            .Select(CalcularTotaisDaPessoa)
            .ToList();

        // Total geral = soma dos totais individuais já calculados.
        return new ResumoTotaisDto
        {
            Pessoas = totaisPorPessoa,
            TotalReceitas = totaisPorPessoa.Sum(t => t.TotalReceitas),
            TotalDespesas = totaisPorPessoa.Sum(t => t.TotalDespesas),
            SaldoLiquido = totaisPorPessoa.Sum(t => t.Saldo)
        };
    }

    /// <summary>
    /// Calcula receitas, despesas e saldo de uma única pessoa a partir de suas transações.
    /// </summary>
    private static TotalPessoaDto CalcularTotaisDaPessoa(Pessoa pessoa)
    {
        var totalReceitas = pessoa.Transacoes
            .Where(t => t.Tipo == TipoTransacao.Receita)
            .Sum(t => t.Valor);

        var totalDespesas = pessoa.Transacoes
            .Where(t => t.Tipo == TipoTransacao.Despesa)
            .Sum(t => t.Valor);

        return new TotalPessoaDto
        {
            PessoaId = pessoa.Id,
            Nome = pessoa.Nome,
            TotalReceitas = totalReceitas,
            TotalDespesas = totalDespesas,
            Saldo = totalReceitas - totalDespesas   // saldo = receita - despesa
        };
    }
}
