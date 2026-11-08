import { calcularOcupacao, Ocupacao } from '../../domain/ocupacao';

/** Dados que chegam no POST /api/calcular-ocupacao. */
export interface DadosCalcularOcupacao {
  totalSalas: number;
  reservasConfirmadas: number;
}

/** Caso de uso: calcular o nível de ocupação das salas. */
export class CalcularOcupacaoUseCase {
  executar(dados: DadosCalcularOcupacao): Ocupacao {
    return calcularOcupacao(Number(dados?.totalSalas), Number(dados?.reservasConfirmadas));
  }
}
