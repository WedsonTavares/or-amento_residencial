# Controle de Gastos Residenciais

Sistema para controle de gastos residenciais com cadastro de pessoas, cadastro de
transações (receitas e despesas) e consulta de totais por pessoa e no geral.

Tecnologias usadas:

- Back-end: .NET 8 (C#) com Web API REST
- Front-end: React com TypeScript (Vite)
- Persistência: SQLite via Entity Framework Core, então os dados continuam salvos depois de fechar a aplicação

## Arquitetura

O projeto segue um único padrão em camadas, coeso do back-end ao front-end, seguindo o mesmo estilo arquitetural.

### Back-end (Controller para Service para DbContext)

```
backend/ControleGastos.Api/
├── Domain/          Entidades e regras de domínio (Pessoa, Transacao, TipoTransacao)
├── Data/            AppDbContext (EF Core), mapeamento e acesso ao banco
├── DTOs/            Objetos de entrada e saída da API (com validações)
├── Services/        Regras de negócio (interfaces e implementações)
├── Controllers/     Endpoints REST (camada fina que orquestra HTTP e Service)
├── Exceptions/      Exceções de domínio (NaoEncontrado, RegraDeNegocio)
├── Infrastructure/  Tratamento global de exceções (ProblemDetails)
└── Program.cs       Composição da aplicação (DI, CORS, banco, pipeline)
```

Decisão de projeto: o `DbContext` do EF Core já implementa os padrões Repository e
Unit of Work, então os serviços conversam diretamente com ele. Uma camada de
repositório adicional seria redundante neste escopo.

### Front-end (camadas espelhando a API)

```
frontend/src/
├── types/        Tipos que espelham os DTOs da API
├── api/          Cliente HTTP (fetch) e módulos por recurso
├── utils/        Formatação de moeda e tratamento de erros
├── components/   Componentes reutilizáveis (Layout, Alerta, ícones)
└── pages/        Telas: Pessoas, Transações e Totais
```

## Regras de negócio implementadas

| Regra | Onde é garantida |
|---|---|
| Identificadores únicos gerados automaticamente (GUID) | Serviços (back-end) |
| Ao excluir uma pessoa, suas transações são apagadas em cascata | `AppDbContext` (`OnDelete: Cascade`) |
| Menor de 18 anos só pode registrar despesas | `TransacaoService` (com reforço no front) |
| A pessoa informada na transação precisa existir | `TransacaoService` (retorna 404) |
| Totais por pessoa (receitas, despesas e saldo) mais o total geral | `TotaisService` |

## Recursos adicionais

O desafio pedia apenas criação, exclusão e listagem de pessoas, e criação e
listagem de transações. Além disso, foi adicionada a edição:

- Edição de pessoa (nome e idade)
- Edição de transação (descrição, valor, tipo e pessoa)

Na edição de transação as mesmas regras de negócio da criação são revalidadas, por
exemplo, um menor de idade continua não podendo ter receita. Nas duas telas a
edição pede confirmação antes de salvar.

## Como executar

### Pré-requisitos

- .NET SDK 8 (rode `dotnet --version` e confirme que mostra 8.x)
- Node.js 18 ou superior (rode `node --version`)

### 1. Back-end (API)

```bash
cd backend/ControleGastos.Api
dotnet run
```

- API em `http://localhost:5087`
- Documentação Swagger em `http://localhost:5087/swagger`
- O banco `controlegastos.db` (SQLite) é criado automaticamente na primeira execução

### 2. Front-end (interface)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

- Interface em `http://localhost:5173`
- A URL da API pode ser ajustada no arquivo `frontend/.env` (`VITE_API_URL`)

Inicie o back-end antes do front-end para que a interface consiga carregar os dados.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pessoas` | Lista as pessoas |
| POST | `/api/pessoas` | Cria uma pessoa |
| PUT | `/api/pessoas/{id}` | Atualiza o nome e a idade de uma pessoa |
| DELETE | `/api/pessoas/{id}` | Remove a pessoa e suas transações |
| GET | `/api/transacoes` | Lista as transações |
| POST | `/api/transacoes` | Cria uma transação |
| PUT | `/api/transacoes/{id}` | Atualiza uma transação |
| GET | `/api/totais` | Retorna os totais por pessoa e o total geral |

## Observações

- A lógica e a função de cada parte estão documentadas por comentários e
  documentação XML no próprio código.
- O código não contém nenhuma referência ao nome da empresa avaliadora.
