# Controle de Gastos Residenciais

Sistema para controle de gastos residenciais: cadastro de **pessoas**, cadastro de
**transações** (receitas/despesas) e **consulta de totais** por pessoa e no geral.

- **Back-end:** .NET 8 (C#) — Web API REST
- **Front-end:** React + TypeScript (Vite)
- **Persistência:** SQLite via Entity Framework Core (os dados sobrevivem ao fechar a aplicação)

---

## Arquitetura

O projeto segue um único padrão em camadas, coeso do back-end ao front-end, sem
misturar estilos arquiteturais.

### Back-end — `Controller → Service → DbContext`

```
backend/ControleGastos.Api/
├── Domain/          Entidades e regras de domínio (Pessoa, Transacao, TipoTransacao)
├── Data/            AppDbContext (EF Core) — mapeamento e acesso ao banco
├── DTOs/            Objetos de entrada/saída da API (com validações)
├── Services/        Regras de negócio (interfaces + implementações)
├── Controllers/     Endpoints REST (camada fina que orquestra HTTP → Service)
├── Exceptions/      Exceções de domínio (NaoEncontrado, RegraDeNegocio)
├── Infrastructure/  Tratamento global de exceções (ProblemDetails)
└── Program.cs       Composição da aplicação (DI, CORS, banco, pipeline)
```

> **Decisão de projeto:** o `DbContext` do EF Core já implementa os padrões
> Repository e Unit of Work, portanto os serviços conversam diretamente com ele.
> Uma camada de repositório adicional seria redundante neste escopo.

### Front-end — camadas espelhando a API

```
frontend/src/
├── types/        Tipos que espelham os DTOs da API
├── api/          Cliente HTTP (fetch) + módulos por recurso
├── utils/        Formatação de moeda e tratamento de erros
├── components/   Componentes reutilizáveis (Layout, Alerta, ícones…)
└── pages/        Telas: Pessoas, Transações, Totais
```

---

## Regras de negócio implementadas

| Regra | Onde é garantida |
|---|---|
| Identificadores únicos gerados automaticamente (GUID) | Serviços (back-end) |
| Ao excluir uma pessoa, suas transações são apagadas (cascata) | `AppDbContext` (`OnDelete: Cascade`) |
| Transações só podem ser **criadas e listadas** (sem edição/exclusão) | Endpoints expostos |
| Menor de 18 anos só pode registrar **despesas** | `TransacaoService` (+ reforço no front) |
| A pessoa informada na transação precisa existir | `TransacaoService` (retorna 404) |
| Totais por pessoa (receitas, despesas, saldo) + total geral | `TotaisService` |

---

## Como executar

### Pré-requisitos
- [.NET SDK 8](https://dotnet.microsoft.com/download) (`dotnet --version` deve mostrar 8.x)
- [Node.js 18+](https://nodejs.org/) (`node --version`)

### 1) Back-end (API)

```bash
cd backend/ControleGastos.Api
dotnet run
```

- API em `http://localhost:5087`
- Documentação Swagger em `http://localhost:5087/swagger`
- O banco `controlegastos.db` (SQLite) é criado automaticamente na primeira execução.

### 2) Front-end (interface)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

- Interface em `http://localhost:5173`
- A URL da API pode ser ajustada no arquivo `frontend/.env` (`VITE_API_URL`).

> Inicie o back-end antes do front-end para que a interface consiga carregar os dados.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/pessoas` | Lista as pessoas |
| `POST` | `/api/pessoas` | Cria uma pessoa |
| `DELETE` | `/api/pessoas/{id}` | Remove a pessoa e suas transações |
| `GET` | `/api/transacoes` | Lista as transações |
| `POST` | `/api/transacoes` | Cria uma transação |
| `GET` | `/api/totais` | Retorna os totais por pessoa + total geral |

---

## Observações

- A lógica e a função de cada parte estão documentadas por comentários e
  documentação XML no próprio código.
- O código não contém nenhuma referência ao nome da empresa avaliadora.
