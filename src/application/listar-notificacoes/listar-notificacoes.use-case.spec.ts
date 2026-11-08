import { NotificacaoRepositoryEmMemoria } from '../../../test/fakes/notificacao.repository.em-memoria';
import { ListarNotificacoesUseCase } from './listar-notificacoes.use-case';

describe('Listar notificações', () => {
  it('devolve só as 10 mais recentes, da mais nova para a mais antiga', async () => {
    const repositorio = new NotificacaoRepositoryEmMemoria();
    for (let i = 1; i <= 12; i++) {
      const minuto = String(i).padStart(2, '0');
      await repositorio.salvar({
        eventId: `e${i}`,
        reservaId: `r${i}`,
        alunoId: 'A-10',
        salaId: 's1',
        mensagem: `notificação ${i}`,
        criadaEm: `2026-11-08T14:${minuto}:00.000Z`,
      });
    }

    const lista = await new ListarNotificacoesUseCase(repositorio).executar();

    expect(lista).toHaveLength(10);
    expect(lista[0].eventId).toBe('e12');
    expect(lista[9].eventId).toBe('e3');
  });
});
