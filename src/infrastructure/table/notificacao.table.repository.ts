import { TableClient } from '@azure/data-tables';
import { NotificacaoRepository } from '../../application/notificacao.repository';
import { Notificacao } from '../../domain/notificacao';

/** Nome da tabela no Azure Table Storage. */
const NOME_DA_TABELA = 'notificacoes';

/** Todas as notificações ficam na mesma "partição" (o volume é pequeno). */
const PARTICAO = 'notificacoes';

/**
 * Implementação da porta NotificacaoRepository usando Azure Table Storage.
 * A chave da linha (rowKey) é o eventId: gravar o mesmo evento duas vezes
 * substitui a linha em vez de criar outra (idempotência).
 */
export class NotificacaoTableRepository implements NotificacaoRepository {
  private readonly tabela: TableClient;
  private tabelaCriada = false;

  constructor(connectionString: string) {
    this.tabela = TableClient.fromConnectionString(connectionString, NOME_DA_TABELA);
  }

  /** Na primeira vez, cria a tabela se ela ainda não existir. */
  private async garantirTabela(): Promise<void> {
    if (!this.tabelaCriada) {
      await this.tabela.createTable(); // não dá erro se a tabela já existir
      this.tabelaCriada = true;
    }
  }

  async salvar(notificacao: Notificacao): Promise<void> {
    await this.garantirTabela();
    await this.tabela.upsertEntity(
      {
        partitionKey: PARTICAO,
        rowKey: notificacao.eventId,
        reservaId: notificacao.reservaId,
        alunoId: notificacao.alunoId,
        salaId: notificacao.salaId,
        mensagem: notificacao.mensagem,
        criadaEm: notificacao.criadaEm,
      },
      'Replace',
    );
  }

  async listarTodas(): Promise<Notificacao[]> {
    await this.garantirTabela();
    const notificacoes: Notificacao[] = [];
    const linhas = this.tabela.listEntities<Omit<Notificacao, 'eventId'>>({
      queryOptions: { filter: `PartitionKey eq '${PARTICAO}'` },
    });
    for await (const linha of linhas) {
      notificacoes.push({
        eventId: linha.rowKey!,
        reservaId: linha.reservaId,
        alunoId: linha.alunoId,
        salaId: linha.salaId,
        mensagem: linha.mensagem,
        criadaEm: linha.criadaEm,
      });
    }
    return notificacoes;
  }
}
