import { app, InvocationContext } from '@azure/functions';
import { ReservaConfirmadaEvento } from '../domain/notificacao';
import { registrarNotificacao } from './dependencias';

/**
 * Gatilho de FILA: roda sozinho sempre que chega uma mensagem na fila "reserva-confirmada".
 * O Azure já decodifica o Base64 e entrega o JSON do evento pronto.
 * Se der erro 5 vezes, a mensagem vai para a fila "reserva-confirmada-poison".
 */
app.storageQueue('notificar-reserva', {
  queueName: 'reserva-confirmada',
  connection: 'AzureWebJobsStorage',
  handler: async (mensagem: unknown, context: InvocationContext): Promise<void> => {
    const evento = mensagem as ReservaConfirmadaEvento;
    const notificacao = await registrarNotificacao.executar(evento);
    context.log(`Notificação registrada para a reserva ${notificacao.reservaId}: ${notificacao.mensagem}`);
  },
});
