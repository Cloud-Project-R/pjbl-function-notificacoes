import { Notificacao } from '../../domain/notificacao';
import { NotificacaoRepository } from '../notificacao.repository';

/** Quantas notificações a rota devolve. */
export const LIMITE_DE_NOTIFICACOES = 10;

/** Caso de uso: devolver as 10 notificações mais recentes. */
export class ListarNotificacoesUseCase {
  constructor(private readonly repositorio: NotificacaoRepository) {}

  async executar(): Promise<Notificacao[]> {
    const todas = await this.repositorio.listarTodas();
    return todas
      .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm)) // mais recente primeiro
      .slice(0, LIMITE_DE_NOTIFICACOES);
  }
}
