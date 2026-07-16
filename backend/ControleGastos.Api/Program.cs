using System.Reflection;
using System.Text.Json.Serialization;
using ControleGastos.Api.Data;
using ControleGastos.Api.Infrastructure;
using ControleGastos.Api.Services;
using Microsoft.EntityFrameworkCore;

// ---------------------------------------------------------------------------
// Ponto de entrada da aplicação (modelo minimal hosting do .NET 8).
// Aqui apenas configuramos: banco de dados, injeção de dependências,
// serialização, CORS e o pipeline HTTP. Nenhuma regra de negócio vive aqui.
// ---------------------------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);

// Nome da política de CORS que libera o servidor de desenvolvimento do React.
const string FrontendCorsPolicy = "PermitirFrontend";

// --- Banco de dados (SQLite via EF Core) -----------------------------------
// A connection string vem do appsettings.json ("Data Source=controlegastos.db"),
// gerando um arquivo local que persiste os dados entre execuções.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// --- Injeção de dependências dos serviços de aplicação ----------------------
// Cada serviço concentra as regras de negócio de um recurso. Os controllers
// dependem apenas das interfaces, mantendo baixo acoplamento.
builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();
builder.Services.AddScoped<ITotaisService, TotaisService>();

// --- Tratamento global de exceções -----------------------------------------
// Traduz exceções de domínio (ex.: recurso não encontrado, regra violada)
// em respostas HTTP padronizadas (ProblemDetails), mantendo os controllers limpos.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// --- Controllers + serialização JSON ----------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        // Serializa enums como texto ("Despesa"/"Receita") em vez de números,
        // deixando a API mais legível e o contrato com o front mais claro.
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Swagger para documentação/testes manuais da API.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Inclui os comentários XML (summaries) do código na documentação do Swagger,
    // deixando cada endpoint e modelo descrito diretamente na interface.
    var arquivoXml = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var caminhoXml = Path.Combine(AppContext.BaseDirectory, arquivoXml);
    if (File.Exists(caminhoXml))
    {
        options.IncludeXmlComments(caminhoXml);
    }
});

// --- CORS -------------------------------------------------------------------
// Libera apenas a origem do front em desenvolvimento (Vite = porta 5173).
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// --- Criação/garantia do schema do banco ------------------------------------
// EnsureCreated() cria o arquivo SQLite e as tabelas na primeira execução.
// Para um schema simples e estável como este, é suficiente e evita a
// necessidade de migrations (que poderiam ser adotadas caso o modelo evolua).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// --- Pipeline HTTP ----------------------------------------------------------
app.UseExceptionHandler();      // captura exceções e devolve ProblemDetails
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(FrontendCorsPolicy);
app.MapControllers();

app.Run();
