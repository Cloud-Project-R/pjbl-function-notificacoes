import { criarNotificacao, Notificacao, ReservaConfirmadaEvento } from '../../domain/notificacao';
import { NotificacaoRepository } from '../notificacao.repository';

/** Caso de uso: receber o evento da fila e registrar a notificação simulada. */
export class RegistrarNotificacaoUseCase {
  constructor(private readonly repositorio: NotificacaoRepository) {}

  async executar(evento: ReservaConfirmadaEvento): Promise<Notificacao> {
    const notificacao = criarNotificacao(evento);
    await this.repositorio.salvar(notificacao); // mesmo eventId = mesma linha (idempotência)
    return notificacao;
  }
}
