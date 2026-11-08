import { ErroDeValidacao } from './erros';

/** Evento que chega pela fila "reserva-confirmada" (publicado pelo MS Reservas). */
export interface ReservaConfirmadaEvento {
  eventId: string;
  type: string;
  version: number;
  occurredAt: string;
  universidadeId: string;
  data: {
    reservaId: string;
    salaId: string;
    alunoId: string;
    inicio: string;
    fim: string;
  };
}

/** Notificação simulada (no lugar de um e-mail de verdade). */
export interface Notificacao {
  eventId: string; // usado como chave: o mesmo evento nunca vira duas notificações
  reservaId: string;
  alunoId: string;
  salaId: string;
  mensagem: string;
  criadaEm: string;
}

/**
 * Transforma o evento ReservaConfirmada em uma notificação.
 * Se o evento vier incompleto, lança ErroDeValidacao (a mensagem vai para a fila de falhas).
 */
export function criarNotificacao(evento: ReservaConfirmadaEvento, agora: Date = new Date()): Notificacao {
  if (!evento || evento.type !== 'ReservaConfirmada' || !evento.eventId || !evento.data?.reservaId) {
    throw new ErroDeValidacao('Evento ReservaConfirmada inválido ou incompleto.');
  }

  return {
    eventId: evento.eventId,
    reservaId: evento.data.reservaId,
    alunoId: evento.data.alunoId,
    salaId: evento.data.salaId,
    mensagem: `E-mail simulado enviado ao aluno ${evento.data.alunoId}: reserva da sala ${evento.data.salaId} confirmada para ${evento.data.inicio}.`,
    criadaEm: agora.toISOString(),
  };
}
