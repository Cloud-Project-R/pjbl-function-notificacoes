import { CalcularOcupacaoUseCase } from '../application/calcular-ocupacao/calcular-ocupacao.use-case';
import { ListarNotificacoesUseCase } from '../application/listar-notificacoes/listar-notificacoes.use-case';
import { RegistrarNotificacaoUseCase } from '../application/registrar-notificacao/registrar-notificacao.use-case';
import { NotificacaoTableRepository } from '../infrastructure/table/notificacao.table.repository';

/**
 * Liga as peças (papel do app.module.ts nos outros serviços).
 * A tabela usa a mesma Storage Account da Function (variável AzureWebJobsStorage).
 */
const repositorio = new NotificacaoTableRepository(process.env.AzureWebJobsStorage ?? '');

export const calcularOcupacao = new CalcularOcupacaoUseCase();
export const registrarNotificacao = new RegistrarNotificacaoUseCase(repositorio);
export const listarNotificacoes = new ListarNotificacoesUseCase(repositorio);
