import { ErroDeValidacao } from '../../domain/erros';
import { ReservaConfirmadaEvento } from '../../domain/notificacao';
import { NotificacaoRepositoryEmMemoria } from '../../../test/fakes/notificacao.repository.em-memoria';
import { RegistrarNotificacaoUseCase } from './registrar-notificacao.use-case';

const evento: ReservaConfirmadaEvento = {
  eventId: 'b3a1c9de-2f4a-4c1e-9d3b-7a5e1f0c8a11',
  type: 'ReservaConfirmada',
  version: 1,
  occurredAt: '2026-11-08T14:00:00Z',
  universidadeId: 'UNI-001',
  data: { reservaId: 'r1', salaId: 's1', alunoId: 'A-10', inicio: '2026-11-10T13:00:00Z', fim: '2026-11-10T14:00:00Z' },
};

describe('Registrar notificação', () => {
  let repositorio: NotificacaoRepositoryEmMemoria;
  let registrar: RegistrarNotificacaoUseCase;

  beforeEach(() => {
    repositorio = new NotificacaoRepositoryEmMemoria();
    registrar = new RegistrarNotificacaoUseCase(repositorio);
  });

  it('transforma o evento em uma notificação para o aluno', async () => {
    const notificacao = await registrar.executar(evento);

    expect(notificacao.reservaId).toBe('r1');
    expect(notificacao.mensagem).toContain('A-10');
    expect(repositorio.notificacoes.size).toBe(1);
  });

  it('o mesmo evento lido duas vezes não cria notificação duplicada (idempotência)', async () => {
    await registrar.executar(evento);
    await registrar.executar(evento);

    expect(repositorio.notificacoes.size).toBe(1);
  });

  it('rejeita evento de outro tipo ou incompleto', async () => {
    await expect(registrar.executar({ ...evento, type: 'OutroEvento' })).rejects.toThrow(ErroDeValidacao);
    await expect(registrar.executar({} as ReservaConfirmadaEvento)).rejects.toThrow(ErroDeValidacao);
  });
});
