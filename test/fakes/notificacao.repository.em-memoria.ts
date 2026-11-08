import { NotificacaoRepository } from '../../src/application/notificacao.repository';
import { Notificacao } from '../../src/domain/notificacao';

/** Armazenamento FALSO, usado só nos testes (sem Azure Table Storage). */
export class NotificacaoRepositoryEmMemoria implements NotificacaoRepository {
  /** Chave = eventId, igual à tabela de verdade. */
  notificacoes = new Map<string, Notificacao>();

  async salvar(notificacao: Notificacao): Promise<void> {
    this.notificacoes.set(notificacao.eventId, notificacao);
  }

  async listarTodas(): Promise<Notificacao[]> {
    return [...this.notificacoes.values()];
  }
}
