import { app, HttpResponseInit } from '@azure/functions';
import { listarNotificacoes } from './dependencias';

/**
 * Gatilho HTTP: GET /api/notificacoes
 * Devolve as 10 notificações mais recentes.
 * authLevel "function": só responde com a chave no cabeçalho x-functions-key.
 */
app.http('notificacoes', {
  methods: ['GET'],
  authLevel: 'function',
  handler: async (): Promise<HttpResponseInit> => {
    return { status: 200, jsonBody: await listarNotificacoes.executar() };
  },
});
