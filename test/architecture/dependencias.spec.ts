import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * TESTE DE ARQUITETURA
 * Lê os "imports" de cada arquivo e falha se alguma camada usar o que não pode.
 * Na Function, a pasta "functions" faz o papel da camada API (os gatilhos HTTP e de fila).
 */

/** Lista todos os arquivos de uma pasta (e das subpastas). */
const listarArquivos = (pasta: string): string[] =>
  readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? listarArquivos(caminho) : [caminho];
  });

/** Devolve os imports proibidos encontrados na pasta (lista vazia = tudo certo). */
const importsProibidos = (pasta: string, termos: string[]): string[] =>
  listarArquivos(pasta)
    .filter((arquivo) => arquivo.endsWith('.ts') && !arquivo.endsWith('.spec.ts'))
    .flatMap((arquivo) => {
      const texto = readFileSync(arquivo, 'utf-8');
      const imports = [...texto.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
      return imports
        .filter((i) => termos.some((termo) => i.includes(termo)))
        .map((i) => `${arquivo} -> ${i}`);
    });

describe('Regras de arquitetura', () => {
  it('domain não depende de application, infrastructure, functions nem do Azure', () => {
    expect(importsProibidos('src/domain', ['/application', '/infrastructure', '/functions', '@azure'])).toEqual([]);
  });

  it('application não depende de infrastructure, functions nem do Azure', () => {
    expect(importsProibidos('src/application', ['/infrastructure', '/functions', '@azure'])).toEqual([]);
  });

  it('infrastructure não depende das functions', () => {
    expect(importsProibidos('src/infrastructure', ['/functions'])).toEqual([]);
  });
});
