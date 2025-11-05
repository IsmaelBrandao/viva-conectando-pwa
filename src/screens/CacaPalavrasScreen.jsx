// src/screens/CacaPalavrasScreen.jsx

import React, { useState, useEffect } from 'react';
import { COLORS, SIZES } from '../styles/colors';

export default function CacaPalavrasScreen({ onVoltar }) {
  const [nivel, setNivel] = useState(null);
  const [tema, setTema] = useState(null);
  const [grid, setGrid] = useState([]);
  const [palavras, setPalavras] = useState([]);
  const [palavrasEncontradas, setPalavrasEncontradas] = useState([]);
  const [celulaSelecionada, setCelulaSelecionada] = useState(null);
  const [direcaoSelecao, setDirecaoSelecao] = useState(null);
  const [celulasSelecionadas, setCelulasSelecionadas] = useState([]);

  // Temas com palavras
  const temas = {
    animais: {
      nome: 'Animais',
      palavras: ['GATO', 'CACHORRO', 'PATO', 'LEAO', 'URSO', 'SAPO'],
    },
    frutas: {
      nome: 'Frutas',
      palavras: ['MACA', 'UVA', 'PERA', 'MELAO', 'MANGA', 'COCO'],
    },
    familia: {
      nome: 'Família',
      palavras: ['MAE', 'PAI', 'AVO', 'TIO', 'PRIMO', 'IRMAO'],
    },
  };

  // Gerar grid
  const gerarGrid = (tamanho, palavrasList) => {
    const novoGrid = Array(tamanho).fill(null).map(() => Array(tamanho).fill(''));
    const palavrasColocadas = [];

    // Colocar palavras
    palavrasList.forEach((palavra) => {
      let colocada = false;
      let tentativas = 0;

      while (!colocada && tentativas < 100) {
        const direcao = Math.random() < 0.5 ? 'H' : 'V'; // Horizontal ou Vertical
        const linha = Math.floor(Math.random() * tamanho);
        const coluna = Math.floor(Math.random() * tamanho);

        if (podeColocarPalavra(novoGrid, palavra, linha, coluna, direcao, tamanho)) {
          colocarPalavra(novoGrid, palavra, linha, coluna, direcao);
          palavrasColocadas.push({
            palavra,
            linha,
            coluna,
            direcao,
          });
          colocada = true;
        }

        tentativas++;
      }
    });

    // Preencher espaços vazios com letras aleatórias
    for (let i = 0; i < tamanho; i++) {
      for (let j = 0; j < tamanho; j++) {
        if (novoGrid[i][j] === '') {
          novoGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    return { grid: novoGrid, palavrasInfo: palavrasColocadas };
  };

  const podeColocarPalavra = (grid, palavra, linha, coluna, direcao, tamanho) => {
    if (direcao === 'H') {
      if (coluna + palavra.length > tamanho) return false;
      for (let i = 0; i < palavra.length; i++) {
        if (grid[linha][coluna + i] !== '' && grid[linha][coluna + i] !== palavra[i]) {
          return false;
        }
      }
    } else {
      if (linha + palavra.length > tamanho) return false;
      for (let i = 0; i < palavra.length; i++) {
        if (grid[linha + i][coluna] !== '' && grid[linha + i][coluna] !== palavra[i]) {
          return false;
        }
      }
    }
    return true;
  };

  const colocarPalavra = (grid, palavra, linha, coluna, direcao) => {
    if (direcao === 'H') {
      for (let i = 0; i < palavra.length; i++) {
        grid[linha][coluna + i] = palavra[i];
      }
    } else {
      for (let i = 0; i < palavra.length; i++) {
        grid[linha + i][coluna] = palavra[i];
      }
    }
  };

  const iniciarJogo = (nivelEscolhido, temaEscolhido) => {
    setNivel(nivelEscolhido);
    setTema(temaEscolhido);

    const tamanho = nivelEscolhido === 'facil' ? 6 : nivelEscolhido === 'medio' ? 8 : 10;
    const numPalavras = nivelEscolhido === 'facil' ? 3 : nivelEscolhido === 'medio' ? 4 : 5;
    
    const temaData = temas[temaEscolhido];
    const palavrasEscolhidas = temaData.palavras.slice(0, numPalavras);

    const { grid: novoGrid, palavrasInfo } = gerarGrid(tamanho, palavrasEscolhidas);
    
    setGrid(novoGrid);
    setPalavras(palavrasInfo);
    setPalavrasEncontradas([]);
    setCelulaSelecionada(null);
    setDirecaoSelecao(null);
    setCelulasSelecionadas([]);
  };

  const handleCelulaClick = (linha, coluna) => {
    if (!celulaSelecionada) {
      setCelulaSelecionada({ linha, coluna });
      setCelulasSelecionadas([`${linha}-${coluna}`]);
    } else {
      // Verificar se forma uma linha reta (horizontal ou vertical)
      const ehMesmaLinha = celulaSelecionada.linha === linha;
      const ehMesmaColuna = celulaSelecionada.coluna === coluna;

      if (ehMesmaLinha || ehMesmaColuna) {
        const celulas = [];
        
        if (ehMesmaLinha) {
          const inicio = Math.min(celulaSelecionada.coluna, coluna);
          const fim = Math.max(celulaSelecionada.coluna, coluna);
          for (let c = inicio; c <= fim; c++) {
            celulas.push(`${linha}-${c}`);
          }
        } else {
          const inicio = Math.min(celulaSelecionada.linha, linha);
          const fim = Math.max(celulaSelecionada.linha, linha);
          for (let l = inicio; l <= fim; l++) {
            celulas.push(`${l}-${coluna}`);
          }
        }

        // Verificar se forma uma palavra
        verificarPalavra(celulas);
      }

      setCelulaSelecionada(null);
      setCelulasSelecionadas([]);
    }
  };

  const verificarPalavra = (celulas) => {
    const palavra = celulas.map((c) => {
      const [l, col] = c.split('-').map(Number);
      return grid[l][col];
    }).join('');

    const palavraReversa = palavra.split('').reverse().join('');

    for (let i = 0; i < palavras.length; i++) {
      const p = palavras[i];
      if ((p.palavra === palavra || p.palavra === palavraReversa) && !palavrasEncontradas.includes(i)) {
        setPalavrasEncontradas([...palavrasEncontradas, i]);
        alert(`🎉 Você encontrou: ${p.palavra}!`);
        return;
      }
    }
  };

  const reiniciarJogo = () => {
    if (nivel && tema) {
      iniciarJogo(nivel, tema);
    }
  };

  const voltarMenu = () => {
    setNivel(null);
    setTema(null);
  };

  useEffect(() => {
    if (palavrasEncontradas.length === palavras.length && palavras.length > 0) {
      setTimeout(() => {
        alert('🎉 Parabéns! Você encontrou todas as palavras!');
      }, 500);
    }
  }, [palavrasEncontradas, palavras]);

  // MENU DE SELEÇÃO
  if (!nivel) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🔍 Caça-Palavras</h1>
          <p style={styles.subtitulo}>Escolha o nível:</p>
        </header>

        <main style={styles.main}>
          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.success }}
            onClick={() => setNivel('facil')}
          >
            <span style={styles.iconeNivel}>😊</span>
            <span style={styles.textoNivel}>FÁCIL</span>
            <span style={styles.descricaoNivel}>Grade 6x6 - 3 palavras</span>
          </button>

          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.warning }}
            onClick={() => setNivel('medio')}
          >
            <span style={styles.iconeNivel}>😐</span>
            <span style={styles.textoNivel}>MÉDIO</span>
            <span style={styles.descricaoNivel}>Grade 8x8 - 4 palavras</span>
          </button>

          <button
            style={{ ...styles.botaoNivel, backgroundColor: COLORS.danger }}
            onClick={() => setNivel('dificil')}
          >
            <span style={styles.iconeNivel}>😤</span>
            <span style={styles.textoNivel}>DIFÍCIL</span>
            <span style={styles.descricaoNivel}>Grade 10x10 - 5 palavras</span>
          </button>

          <button
            style={{
              ...styles.botaoNivel,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={onVoltar}
          >
            <span style={styles.iconeNivel}>⬅️</span>
            <span style={styles.textoNivel}>VOLTAR AO INÍCIO</span>
          </button>
        </main>
      </div>
    );
  }

  // SELEÇÃO DE TEMA
  if (!tema) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🔍 Caça-Palavras</h1>
          <p style={styles.subtitulo}>Escolha o tema:</p>
        </header>

        <main style={styles.main}>
          {Object.keys(temas).map((temaKey) => (
            <button
              key={temaKey}
              style={{ ...styles.botaoNivel, backgroundColor: COLORS.primary }}
              onClick={() => iniciarJogo(nivel, temaKey)}
            >
              <span style={styles.iconeNivel}>
                {temaKey === 'animais' ? '🐾' : temaKey === 'frutas' ? '🍎' : '👨‍👩‍👧'}
              </span>
              <span style={styles.textoNivel}>{temas[temaKey].nome.toUpperCase()}</span>
            </button>
          ))}

          <button
            style={{
              ...styles.botaoNivel,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={() => setNivel(null)}
          >
            <span style={styles.iconeNivel}>⬅️</span>
            <span style={styles.textoNivel}>VOLTAR</span>
          </button>
        </main>
      </div>
    );
  }

  // JOGO ATIVO
  const tamanho = nivel === 'facil' ? 6 : nivel === 'medio' ? 8 : 10;
  const tamanhoCelula = Math.min(50, (window.innerWidth - 80) / tamanho);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🔍 Caça-Palavras</h1>
        <p style={styles.subtitulo}>
          Encontradas: {palavrasEncontradas.length}/{palavras.length}
        </p>
      </header>

      <main style={styles.mainJogo}>
        {/* Lista de palavras */}
        <div style={styles.listaPalavras}>
          <h3 style={styles.tituloLista}>Palavras para encontrar:</h3>
          <div style={styles.palavrasContainer}>
            {palavras.map((p, idx) => (
              <span
                key={idx}
                style={{
                  ...styles.palavraItem,
                  textDecoration: palavrasEncontradas.includes(idx) ? 'line-through' : 'none',
                  color: palavrasEncontradas.includes(idx) ? COLORS.success : COLORS.text,
                }}
              >
                {p.palavra}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${tamanho}, ${tamanhoCelula}px)`,
            gap: '2px',
            justifyContent: 'center',
            margin: '20px auto',
          }}
        >
          {grid.map((linha, i) =>
            linha.map((letra, j) => {
              const key = `${i}-${j}`;
              const estaSelecionada = celulasSelecionadas.includes(key);
              const estaEncontrada = palavrasEncontradas.some((idx) => {
                const p = palavras[idx];
                if (p.direcao === 'H' && p.linha === i) {
                  return j >= p.coluna && j < p.coluna + p.palavra.length;
                } else if (p.direcao === 'V' && p.coluna === j) {
                  return i >= p.linha && i < p.linha + p.palavra.length;
                }
                return false;
              });

              return (
                <button
                  key={key}
                  style={{
                    width: tamanhoCelula,
                    height: tamanhoCelula,
                    fontSize: Math.max(16, tamanhoCelula * 0.4),
                    fontWeight: 'bold',
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: '5px',
                    backgroundColor: estaEncontrada
                      ? COLORS.success
                      : estaSelecionada
                      ? COLORS.warning
                      : COLORS.background,
                    color: estaEncontrada ? COLORS.textLight : COLORS.text,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleCelulaClick(i, j)}
                >
                  {letra}
                </button>
              );
            })
          )}
        </div>

        {/* Instrução */}
        <div style={styles.instrucao}>
          <p>💡 Clique na primeira letra, depois na última letra da palavra!</p>
        </div>

        {/* Botões */}
        <div style={styles.botoesControle}>
          <button style={styles.botaoControle} onClick={reiniciarJogo}>
            🔄 REINICIAR
          </button>

          <button
            style={{ ...styles.botaoControle, backgroundColor: COLORS.warning }}
            onClick={voltarMenu}
          >
            📋 MUDAR TEMA
          </button>

          <button
            style={{ ...styles.botaoControle, backgroundColor: COLORS.textSecondary }}
            onClick={onVoltar}
          >
            ⬅️ VOLTAR
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    backgroundColor: COLORS.success,
    padding: SIZES.spacing.large,
    borderBottom: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    textAlign: 'center',
  },

  titulo: {
    fontSize: SIZES.fontSize.xlarge,
    fontWeight: 'bold',
    color: COLORS.textLight,
    margin: 0,
    marginBottom: SIZES.spacing.xs,
  },

  subtitulo: {
    fontSize: SIZES.fontSize.medium,
    color: COLORS.textLight,
    margin: 0,
    fontWeight: '600',
  },

  main: {
    flex: 1,
    padding: SIZES.spacing.large,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.spacing.large,
  },

  mainJogo: {
    flex: 1,
    padding: SIZES.spacing.medium,
    overflowY: 'auto',
  },

  botaoNivel: {
    width: '100%',
    maxWidth: 400,
    minHeight: 100,
    padding: SIZES.spacing.medium,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.xs,
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  iconeNivel: {
    fontSize: 40,
  },

  textoNivel: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },

  descricaoNivel: {
    fontSize: SIZES.fontSize.small,
    color: COLORS.textLight,
  },

  listaPalavras: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SIZES.spacing.medium,
    borderRadius: SIZES.borderRadius,
    border: `2px solid ${COLORS.border}`,
    marginBottom: SIZES.spacing.medium,
  },

  tituloLista: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing.small,
    textAlign: 'center',
  },

  palavrasContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: SIZES.spacing.small,
    justifyContent: 'center',
  },

  palavraItem: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    padding: '8px 16px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    border: `2px solid ${COLORS.border}`,
  },

  instrucao: {
    textAlign: 'center',
    padding: SIZES.spacing.medium,
    backgroundColor: COLORS.warning,
    borderRadius: SIZES.borderRadius,
    margin: '20px 0',
    fontSize: SIZES.fontSize.small,
    fontWeight: 'bold',
  },

  botoesControle: {
    display: 'flex',
    gap: SIZES.spacing.small,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  botaoControle: {
    flex: 1,
    minWidth: 115,
    minHeight: 60,
    padding: SIZES.spacing.small,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    backgroundColor: COLORS.primary,
    fontSize: SIZES.fontSize.small,
    fontWeight: 'bold',
    color: COLORS.textLight,
    cursor: 'pointer',
    textTransform: 'uppercase',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
};