// src/components/DesenhoParaColorir.jsx

import React, { useRef, useEffect } from 'react';
import { COLORS, SIZES } from '../styles/colors';

export default function DesenhoParaColorir({ desenho, cor, onVoltar }) {
  const canvasRef = useRef(null);
  const regioes = useRef([]);

  // Desenhos pré-definidos
  const desenhos = {
    flor: {
      nome: 'Flor',
      desenhar: (ctx, w, h) => {
        const cx = w / 2;
        const cy = h / 2;

        // Centro (círculo amarelo)
        regioes.current.push({
          tipo: 'circulo',
          x: cx,
          y: cy,
          raio: 30,
          corPadrao: '#FFD700',
        });

        // Pétalas (6 pétalas ao redor)
        const numPetalas = 6;
        const raioExterno = 70;
        for (let i = 0; i < numPetalas; i++) {
          const angulo = (Math.PI * 2 * i) / numPetalas;
          const px = cx + Math.cos(angulo) * raioExterno;
          const py = cy + Math.sin(angulo) * raioExterno;

          regioes.current.push({
            tipo: 'circulo',
            x: px,
            y: py,
            raio: 40,
            corPadrao: '#FF69B4',
          });
        }

        // Caule (retângulo)
        regioes.current.push({
          tipo: 'retangulo',
          x: cx - 10,
          y: cy + 30,
          largura: 20,
          altura: 100,
          corPadrao: '#228B22',
        });

        // Folha esquerda
        regioes.current.push({
          tipo: 'circulo',
          x: cx - 30,
          y: cy + 80,
          raio: 20,
          corPadrao: '#32CD32',
        });

        // Folha direita
        regioes.current.push({
          tipo: 'circulo',
          x: cx + 30,
          y: cy + 100,
          raio: 20,
          corPadrao: '#32CD32',
        });
      },
    },

    casa: {
      nome: 'Casa',
      desenhar: (ctx, w, h) => {
        const cx = w / 2;
        const cy = h / 2;

        // Paredes
        regioes.current.push({
          tipo: 'retangulo',
          x: cx - 80,
          y: cy,
          largura: 160,
          altura: 120,
          corPadrao: '#D2691E',
        });

        // Telhado (triângulo)
        regioes.current.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 90, y: cy },
            { x: cx, y: cy - 70 },
            { x: cx + 90, y: cy },
          ],
          corPadrao: '#8B0000',
        });

        // Porta
        regioes.current.push({
          tipo: 'retangulo',
          x: cx - 20,
          y: cy + 50,
          largura: 40,
          altura: 70,
          corPadrao: '#8B4513',
        });

        // Janela esquerda
        regioes.current.push({
          tipo: 'retangulo',
          x: cx - 60,
          y: cy + 30,
          largura: 30,
          altura: 30,
          corPadrao: '#87CEEB',
        });

        // Janela direita
        regioes.current.push({
          tipo: 'retangulo',
          x: cx + 30,
          y: cy + 30,
          largura: 30,
          altura: 30,
          corPadrao: '#87CEEB',
        });

        // Chaminé
        regioes.current.push({
          tipo: 'retangulo',
          x: cx + 40,
          y: cy - 50,
          largura: 20,
          altura: 50,
          corPadrao: '#696969',
        });
      },
    },

    sol: {
      nome: 'Sol',
      desenhar: (ctx, w, h) => {
        const cx = w / 2;
        const cy = h / 2;

        // Centro do sol
        regioes.current.push({
          tipo: 'circulo',
          x: cx,
          y: cy,
          raio: 60,
          corPadrao: '#FFD700',
        });

        // Raios (8 raios ao redor)
        const numRaios = 8;
        const raioInterno = 70;
        const raioExterno = 100;

        for (let i = 0; i < numRaios; i++) {
          const angulo = (Math.PI * 2 * i) / numRaios;
          const x1 = cx + Math.cos(angulo) * raioInterno;
          const y1 = cy + Math.sin(angulo) * raioInterno;
          const x2 = cx + Math.cos(angulo) * raioExterno;
          const y2 = cy + Math.sin(angulo) * raioExterno;

          regioes.current.push({
            tipo: 'triangulo',
            pontos: [
              { x: cx, y: cy },
              { x: x1, y: y1 },
              { x: x2, y: y2 },
            ],
            corPadrao: '#FFA500',
          });
        }
      },
    },
  };

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    canvas.width = Math.min(container.offsetWidth - 40, 500);
    canvas.height = 400;

    regioes.current = [];
    desenharTudo();
  }, [desenho]);

  // Desenhar todas as regiões
  const desenharTudo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Executar função de desenho
    const desenhoAtual = desenhos[desenho];
    if (desenhoAtual) {
      desenhoAtual.desenhar(ctx, canvas.width, canvas.height);
    }

    // Desenhar cada região
    regioes.current.forEach((regiao) => {
      ctx.fillStyle = regiao.corAtual || regiao.corPadrao;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;

      if (regiao.tipo === 'circulo') {
        ctx.beginPath();
        ctx.arc(regiao.x, regiao.y, regiao.raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (regiao.tipo === 'retangulo') {
        ctx.fillRect(regiao.x, regiao.y, regiao.largura, regiao.altura);
        ctx.strokeRect(regiao.x, regiao.y, regiao.largura, regiao.altura);
      } else if (regiao.tipo === 'triangulo') {
        ctx.beginPath();
        ctx.moveTo(regiao.pontos[0].x, regiao.pontos[0].y);
        ctx.lineTo(regiao.pontos[1].x, regiao.pontos[1].y);
        ctx.lineTo(regiao.pontos[2].x, regiao.pontos[2].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  // Detectar clique na região
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Verificar qual região foi clicada (de trás para frente)
    for (let i = regioes.current.length - 1; i >= 0; i--) {
      const regiao = regioes.current[i];

      let dentroRegiao = false;

      if (regiao.tipo === 'circulo') {
        const dx = x - regiao.x;
        const dy = y - regiao.y;
        dentroRegiao = Math.sqrt(dx * dx + dy * dy) <= regiao.raio;
      } else if (regiao.tipo === 'retangulo') {
        dentroRegiao =
          x >= regiao.x &&
          x <= regiao.x + regiao.largura &&
          y >= regiao.y &&
          y <= regiao.y + regiao.altura;
      } else if (regiao.tipo === 'triangulo') {
        // Verificação simples de ponto em triângulo
        dentroRegiao = pontoEmTriangulo(
          { x, y },
          regiao.pontos[0],
          regiao.pontos[1],
          regiao.pontos[2]
        );
      }

      if (dentroRegiao) {
        regiao.corAtual = cor;
        desenharTudo();
        break;
      }
    }
  };

  // Função auxiliar: ponto em triângulo
  const pontoEmTriangulo = (p, p0, p1, p2) => {
    const area = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const s = 1 / (2 * area) * (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y);
    const t = 1 / (2 * area) * (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y);
    return s > 0 && t > 0 && 1 - s - t > 0;
  };

  // Limpar desenho
  const limpar = () => {
    if (!window.confirm('Resetar cores?')) return;
    regioes.current.forEach((r) => (r.corAtual = null));
    desenharTudo();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>
        Colorindo: {desenhos[desenho]?.nome || desenho}
      </h3>

      <div style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          style={styles.canvas}
          onClick={handleClick}
        />
      </div>

      <div style={styles.botoes}>
        <button style={styles.botao} onClick={limpar}>
          🔄 RESETAR CORES
        </button>
        <button
          style={{ ...styles.botao, backgroundColor: COLORS.textSecondary }}
          onClick={onVoltar}
        >
          ⬅️ VOLTAR
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: SIZES.spacing.medium,
    alignItems: 'center',
  },

  titulo: {
    fontSize: SIZES.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
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
    cursor: 'pointer',
    maxWidth: '100%',
  },

  botoes: {
    display: 'flex',
    gap: SIZES.spacing.small,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  botao: {
    flex: 1,
    minWidth: 120,
    padding: SIZES.spacing.medium,
    borderRadius: SIZES.borderRadius,
    border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
    backgroundColor: COLORS.danger,
    fontSize: SIZES.fontSize.small,
    fontWeight: 'bold',
    color: COLORS.textLight,
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
};