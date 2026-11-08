import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { ErroDeValidacao } from '../domain/erros';
import { calcularOcupacao } from './dependencias';

/**
 * Gatilho HTTP: POST /api/calcular-ocupacao
 * Corpo: { "totalSalas": 1, "reservasConfirmadas": 1 }
 * Resposta: { "reservasPorSala": 1, "nivel": "MEDIA" }
 * authLevel "function": só responde com a chave no cabeçalho x-functions-key.
 */
app.http('calcular-ocupacao', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const dados = (await request.json()) as { totalSalas: number; reservasConfirmadas: number };
      return { status: 200, jsonBody: calcularOcupacao.executar(dados) };
    } catch (erro) {
      if (erro instanceof ErroDeValidacao || erro instanceof SyntaxError) {
        return { status: 400, jsonBody: { statusCode: 400, message: (erro as Error).message } };
      }
      throw erro;
    }
  },
});
