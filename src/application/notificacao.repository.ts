import { Notificacao } from '../domain/notificacao';

/**
 * "Porta" do armazenamento de notificações.
 * Quem implementa é a camada infrastructure (no nosso caso, Azure Table Storage).
 */
export interface NotificacaoRepository {
  /** Grava a notificação. Se já existir uma com o mesmo eventId, apenas substitui (sem duplicar). */
  salvar(notificacao: Notificacao): Promise<void>;
  listarTodas(): Promise<Notificacao[]>;
}
