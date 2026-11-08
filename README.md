# pjbl-function-notificacoes

Azure Function (serverless) da Plataforma de Reservas de Salas Universitárias (PJBL – Entrega 3).
Faz duas coisas:

1. **Notificações (evento):** lê o evento `ReservaConfirmada` da fila `reserva-confirmada`
   (publicado pelo MS Reservas) e grava uma notificação simulada no **Azure Table Storage**.
2. **Cálculo de ocupação (HTTP):** recebe o total de salas e de reservas e devolve o nível
   de ocupação (BAIXA, MEDIA ou ALTA). O BFF usa isso no `GET /aggregated-data`.

## Arquitetura

O código segue **Clean Architecture** e **Vertical Slice**, com a pasta `functions` no papel da camada API:

```
src/
├─ domain/            regras do negócio, TypeScript puro
│  ├─ ocupacao.ts       cálculo do nível de ocupação
│  └─ notificacao.ts    evento ReservaConfirmada -> notificação
├─ application/       casos de uso, UMA PASTA POR FUNCIONALIDADE
│  ├─ calcular-ocupacao/
│  ├─ registrar-notificacao/
│  ├─ listar-notificacoes/
│  └─ notificacao.repository.ts   "porta" do armazenamento
├─ infrastructure/    Azure Table Storage
└─ functions/         gatilhos HTTP e de fila (+ dependencias.ts, que liga as peças)
test/architecture/    teste que confere a regra de dependência entre camadas
```

**Idempotência:** a notificação é gravada com o `eventId` como chave. Se a mesma mensagem
for lida duas vezes, a linha é substituída e não duplicada.

**Fila de falhas:** se uma mensagem falhar 5 vezes, o Azure a move para `reserva-confirmada-poison`.

### Funções

| Gatilho | Rota / Fila | O que faz |
|---|---|---|
| HTTP POST | `/api/calcular-ocupacao` | Recebe `{ totalSalas, reservasConfirmadas }`; devolve `{ reservasPorSala, nivel }` |
| Fila | `reserva-confirmada` → `notificar-reserva` | Lê o evento e grava a notificação na tabela `notificacoes` |
| HTTP GET | `/api/notificacoes` | Devolve as 10 últimas notificações |

As rotas HTTP exigem a **chave de função** no cabeçalho `x-functions-key`.
Regra de ocupação: menos de 1 reserva por sala = BAIXA; de 1 a menos de 3 = MEDIA; 3 ou mais = ALTA.

## Tecnologias

Node 22, TypeScript, Azure Functions v4, Azure Storage Queue, Azure Table Storage, Jest.

## Como rodar

**Local** (precisa do Azure Functions Core Tools 4)

1. Copie `local.settings.example.json` para `local.settings.json` e cole a string de conexão da Storage Account.
2. `npm ci`
3. `npm start`

**Testes:** `npm test` (unitários + arquitetura, não precisam do Azure).

**Deploy**

```bash
func azure functionapp publish func-pjbl-notificacoes
```

**Nuvem**

```bash
curl -X POST "https://func-pjbl-notificacoes.azurewebsites.net/api/calcular-ocupacao" \
  -H "x-functions-key: SUA-CHAVE" -H "Content-Type: application/json" \
  -d '{"totalSalas": 1, "reservasConfirmadas": 1}'
```

## Equipe

João Vitor de Moraes Bringmann, Leonardo Grattão, Eduardo Monteiro, Nicolas Lobo
