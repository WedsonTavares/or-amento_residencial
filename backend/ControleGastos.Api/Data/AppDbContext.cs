using ControleGastos.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

/// <summary>
/// Contexto do Entity Framework Core: representa a sessão com o banco SQLite e
/// expõe as tabelas como <see cref="DbSet{TEntity}"/>. Toda a persistência do
/// sistema passa por aqui.
/// <para>Observação de arquitetura: o próprio DbContext já implementa os padrões
/// Repository e Unit of Work, por isso os serviços conversam diretamente com ele,
/// sem uma camada de repositório adicional que seria redundante neste escopo.</para>
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    /// <summary>
    /// Configura o mapeamento das entidades por Fluent API, mantendo as classes
    /// de domínio limpas (sem atributos de persistência).
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(entidade =>
        {
            entidade.HasKey(p => p.Id);
            entidade.Property(p => p.Nome).IsRequired().HasMaxLength(120);

            // Relacionamento 1:N com exclusão em cascata:
            // ao remover uma pessoa, o banco apaga automaticamente suas transações.
            entidade.HasMany(p => p.Transacoes)
                    .WithOne(t => t.Pessoa)
                    .HasForeignKey(t => t.PessoaId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Transacao>(entidade =>
        {
            entidade.HasKey(t => t.Id);
            entidade.Property(t => t.Descricao).IsRequired().HasMaxLength(200);
            entidade.Property(t => t.Valor).IsRequired();

            // Persiste o enum como texto ("Despesa"/"Receita"), deixando o banco
            // legível e resistente a mudanças na ordem dos valores do enum.
            entidade.Property(t => t.Tipo)
                    .HasConversion<string>()
                    .HasMaxLength(20);
        });
    }
}
