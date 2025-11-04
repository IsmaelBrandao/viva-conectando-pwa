// src/screens/PinturaScreen.jsx - VERSÃO CORRIGIDA

import React, { useRef, useEffect, useState } from 'react';
import { COLORS, SIZES } from '../styles/colors';
import DesenhoParaColorir from '../components/DesenhoParaColorir';

export default function PinturaScreen({ onVoltar }) {
  const canvasRef = useRef(null);
  const [corSelecionada, setCorSelecionada] = useState(COLORS.paint.preto);
  const [espessura, setEspessura] = useState(5);
  const [desenhando, setDesenhando] = useState(false);
  const [modo, setModo] = useState('menu');
  const [desenhoEscolhido, setDesenhoEscolhido] = useState(null);

  const cores = [
    { nome: 'Vermelho', cor: COLORS.paint.vermelho },
    { nome: 'Laranja', cor: COLORS.paint.laranja },
    { nome: 'Amarelo', cor: COLORS.paint.amarelo },
    { nome: 'Verde', cor: COLORS.paint.verde },
    { nome: 'Azul', cor: COLORS.paint.azul },
    { nome: 'Roxo', cor: COLORS.paint.roxo },
    { nome: 'Rosa', cor: COLORS.paint.rosa },
    { nome: 'Marrom', cor: COLORS.paint.marrom },
    { nome: 'Preto', cor: COLORS.paint.preto },
    { nome: 'Branco', cor: COLORS.paint.branco },
    { nome: 'Cinza', cor: COLORS.paint.cinza },
    { nome: 'Ciano', cor: COLORS.paint.ciano },
  ];

  useEffect(() => {
    if (modo === 'livre') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      canvas.width = container.offsetWidth - 40;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [modo]);

  const obterCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const iniciarDesenho = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = obterCoordenadas(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = corSelecionada;
    ctx.lineWidth = espessura;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setDesenhando(true);
  };

  const desenhar = (e) => {
    if (!desenhando) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = obterCoordenadas(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const pararDesenho = (e) => {
    e.preventDefault();
    setDesenhando(false);
  };

  const limparTela = () => {
    if (!window.confirm('Tem certeza que deseja apagar tudo?')) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const alternarEspessura = () => {
    if (espessura === 5) setEspessura(10);
    else if (espessura === 10) setEspessura(15);
    else setEspessura(5);
  };

  // RENDERIZAR MENU DE ESCOLHA
  if (modo === 'menu') {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🎨 Pintura Digital</h1>
          <p style={styles.subtitulo}>Escolha o modo:</p>
        </header>

        <main style={styles.main}>
          <button
            style={{ ...styles.botaoModo, backgroundColor: COLORS.primary }}
            onClick={() => setModo('livre')}
          >
            <span style={styles.iconeModo}>✏️</span>
            <span style={styles.textoModo}>DESENHO LIVRE</span>
            <span style={styles.descricaoModo}>Desenhe o que quiser!</span>
          </button>

          <button
            style={{ ...styles.botaoModo, backgroundColor: COLORS.secondary }}
            onClick={() => setModo('colorir')}
          >
            <span style={styles.iconeModo}>🖍️</span>
            <span style={styles.textoModo}>COLORIR DESENHOS</span>
            <span style={styles.descricaoModo}>Pinte desenhos prontos!</span>
          </button>

          <button
            style={{
              ...styles.botaoModo,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={onVoltar}
          >
            <span style={styles.iconeModo}>⬅️</span>
            <span style={styles.textoModo}>VOLTAR AO INÍCIO</span>
          </button>
        </main>
      </div>
    );
  }

  // RENDERIZAR SELEÇÃO DE DESENHO
  if (modo === 'colorir' && !desenhoEscolhido) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🎨 Colorir Desenhos</h1>
          <p style={styles.subtitulo}>Escolha um desenho:</p>
        </header>

        <main style={styles.main}>
          <button
            style={{ ...styles.botaoModo, backgroundColor: COLORS.success }}
            onClick={() => setDesenhoEscolhido('flor')}
          >
            <span style={styles.iconeModo}>🌸</span>
            <span style={styles.textoModo}>FLOR</span>
          </button>

          <button
            style={{ ...styles.botaoModo, backgroundColor: COLORS.warning }}
            onClick={() => setDesenhoEscolhido('casa')}
          >
            <span style={styles.iconeModo}>🏠</span>
            <span style={styles.textoModo}>CASA</span>
          </button>

          {/* ✅ TROCADO: Sol → Coração */}
          <button
            style={{ ...styles.botaoModo, backgroundColor: COLORS.secondary }}
            onClick={() => setDesenhoEscolhido('coracao')}
          >
            <span style={styles.iconeModo}>💖</span>
            <span style={styles.textoModo}>CORAÇÃO</span>
          </button>

          {/* ✅ BOTÃO VOLTAR PADRONIZADO */}
          <button
            style={{
              ...styles.botaoModo,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={() => setModo('menu')}
          >
            <span style={styles.iconeModo}>⬅️</span>
            <span style={styles.textoModo}>VOLTAR</span>
          </button>
        </main>
      </div>
    );
  }

  // RENDERIZAR MODO COLORIR
  if (modo === 'colorir' && desenhoEscolhido) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🎨 Colorir Desenhos</h1>
          <p style={styles.subtitulo}>Clique nas áreas para colorir</p>
        </header>

        <main style={styles.mainJogo}>
          <DesenhoParaColorir
            desenho={desenhoEscolhido}
            cor={corSelecionada}
            onVoltar={() => setDesenhoEscolhido(null)}
          />

          {/* Paleta de Cores */}
          <div style={styles.paletaContainer}>
            <h3 style={styles.paletaTitulo}>Escolha uma cor:</h3>
            <div style={styles.coresGrid}>
              {cores.map((item) => (
                <button
                  key={item.cor}
                  style={{
                    ...styles.corBotao,
                    backgroundColor: item.cor,
                    border:
                      corSelecionada === item.cor
                        ? '5px solid #000'
                        : '3px solid #000',
                    transform:
                      corSelecionada === item.cor ? 'scale(1.15)' : 'scale(1)',
                  }}
                  onClick={() => setCorSelecionada(item.cor)}
                  aria-label={item.nome}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // RENDERIZAR MODO LIVRE
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>🎨 Desenho Livre</h1>
        <p style={styles.subtitulo}>
          Pincel: {espessura === 5 ? 'Fino' : espessura === 10 ? 'Médio' : 'Grosso'}
        </p>
      </header>

      <main style={styles.mainJogo}>
        <div style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            style={styles.canvas}
            onMouseDown={iniciarDesenho}
            onMouseMove={desenhar}
            onMouseUp={pararDesenho}
            onMouseLeave={pararDesenho}
            onTouchStart={iniciarDesenho}
            onTouchMove={desenhar}
            onTouchEnd={pararDesenho}
          />
        </div>

        <div style={styles.paletaContainer}>
          <h3 style={styles.paletaTitulo}>Escolha uma cor:</h3>
          <div style={styles.coresGrid}>
            {cores.map((item) => (
              <button
                key={item.cor}
                style={{
                  ...styles.corBotao,
                  backgroundColor: item.cor,
                  border:
                    corSelecionada === item.cor
                      ? '5px solid #000'
                      : '3px solid #000',
                  transform:
                    corSelecionada === item.cor ? 'scale(1.15)' : 'scale(1)',
                }}
                onClick={() => setCorSelecionada(item.cor)}
                aria-label={item.nome}
              />
            ))}
          </div>
        </div>

        <div style={styles.botoesContainer}>
          <button style={styles.botaoControle} onClick={alternarEspessura}>
            🖌️ PINCEL
          </button>

          <button
            style={{ ...styles.botaoControle, backgroundColor: COLORS.danger }}
            onClick={limparTela}
          >
            🗑️ LIMPAR
          </button>

          <button
            style={{
              ...styles.botaoControle,
              backgroundColor: COLORS.textSecondary,
            }}
            onClick={() => setModo('menu')}
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
    backgroundColor: COLORS.primary,
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
    display: 'flex',
    flexDirection: 'column',
    gap: SIZES.spacing.medium,
  },

  botaoModo: {
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

  iconeModo: {
    fontSize: 48,
  },

  textoModo: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },

  descricaoModo: {
    fontSize: SIZES.fontSize.small,
    color: COLORS.textLight,
  },

  canvasContainer: {
    backgroundColor: COLORS.background,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
  },

  canvas: {
    display: 'block',
    cursor: 'crosshair',
    touchAction: 'none',
    maxWidth: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  paletaContainer: {
    padding: SIZES.spacing.medium,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SIZES.borderRadius,
    border: `2px solid ${COLORS.border}`,
  },

  paletaTitulo: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.spacing.small,
    textAlign: 'center',
  },

  coresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
    gap: '10px',
    justifyItems: 'center',
  },

  corBotao: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  botoesContainer: {
    display: 'flex',
    gap: SIZES.spacing.small,
    flexWrap: 'wrap',
  },

  botaoControle: {
    flex: 1,
    minWidth: 100,
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
    transition: 'all 0.2s',
  },
};