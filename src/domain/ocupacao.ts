import { ErroDeValidacao } from './erros';

export type NivelDeOcupacao = 'BAIXA' | 'MEDIA' | 'ALTA';

/** Resultado do cálculo de ocupação. */
export interface Ocupacao {
  reservasPorSala: number;
  nivel: NivelDeOcupacao;
}

/**
 * Regra do cálculo de ocupação:
 *   reservasPorSala = reservas confirmadas ÷ total de salas
 *   menos de 1 por sala  -> BAIXA
 *   de 1 até menos de 3  -> MEDIA
 *   3 ou mais por sala   -> ALTA
 */
export function calcularOcupacao(totalSalas: number, reservasConfirmadas: number): Ocupacao {
  if (!Number.isInteger(totalSalas) || totalSalas < 0) {
    throw new ErroDeValidacao('totalSalas deve ser um número inteiro maior ou igual a zero.');
  }
  if (!Number.isInteger(reservasConfirmadas) || reservasConfirmadas < 0) {
    throw new ErroDeValidacao('reservasConfirmadas deve ser um número inteiro maior ou igual a zero.');
  }

  // Sem salas não existe ocupação (e evita dividir por zero)
  if (totalSalas === 0) {
    return { reservasPorSala: 0, nivel: 'BAIXA' };
  }

  const reservasPorSala = Math.round((reservasConfirmadas / totalSalas) * 100) / 100; // 2 casas decimais

  let nivel: NivelDeOcupacao = 'ALTA';
  if (reservasPorSala < 1) nivel = 'BAIXA';
  else if (reservasPorSala < 3) nivel = 'MEDIA';

  return { reservasPorSala, nivel };
}
