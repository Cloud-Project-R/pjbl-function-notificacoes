import { ErroDeValidacao } from '../../domain/erros';
import { CalcularOcupacaoUseCase } from './calcular-ocupacao.use-case';

describe('Calcular ocupação', () => {
  const calcular = new CalcularOcupacaoUseCase();

  it('menos de 1 reserva por sala é BAIXA', () => {
    expect(calcular.executar({ totalSalas: 4, reservasConfirmadas: 2 })).toEqual({ reservasPorSala: 0.5, nivel: 'BAIXA' });
  });

  it('1 reserva por sala é MEDIA', () => {
    expect(calcular.executar({ totalSalas: 1, reservasConfirmadas: 1 })).toEqual({ reservasPorSala: 1, nivel: 'MEDIA' });
  });

  it('3 ou mais reservas por sala é ALTA', () => {
    expect(calcular.executar({ totalSalas: 2, reservasConfirmadas: 7 })).toEqual({ reservasPorSala: 3.5, nivel: 'ALTA' });
  });

  it('sem salas a ocupação é BAIXA (não divide por zero)', () => {
    expect(calcular.executar({ totalSalas: 0, reservasConfirmadas: 5 })).toEqual({ reservasPorSala: 0, nivel: 'BAIXA' });
  });

  it('arredonda para 2 casas decimais', () => {
    expect(calcular.executar({ totalSalas: 3, reservasConfirmadas: 1 }).reservasPorSala).toBe(0.33);
  });

  it('rejeita números negativos ou ausentes', () => {
    expect(() => calcular.executar({ totalSalas: -1, reservasConfirmadas: 1 })).toThrow(ErroDeValidacao);
    expect(() => calcular.executar({} as never)).toThrow(ErroDeValidacao);
  });
});
