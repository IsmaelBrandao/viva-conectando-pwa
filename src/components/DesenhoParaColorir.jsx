// src/components/DesenhoParaColorir.jsx - DESENHOS BONITOS E DETALHADOS

import { useRef, useEffect, useState } from 'react';
import { COLORS, SIZES } from '../styles/colors';

export default function DesenhoParaColorir({ desenho, cor, onVoltar }) {
  const canvasRef = useRef(null);
  const [regioes, setRegioes] = useState([]);

  const desenhos = {
    borboleta: {
      nome: 'Borboleta',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Corpo da borboleta (3 círculos verticais)
        areas.push({ tipo: 'circulo', x: cx, y: cy - 30, raio: 15, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy, raio: 20, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy + 30, raio: 12, cor: null });

        // Asa superior esquerda (2 círculos grandes)
        areas.push({ tipo: 'circulo', x: cx - 60, y: cy - 40, raio: 45, cor: null });
        areas.push({ tipo: 'circulo', x: cx - 40, y: cy - 50, raio: 30, cor: null });
        
        // Asa superior direita
        areas.push({ tipo: 'circulo', x: cx + 60, y: cy - 40, raio: 45, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 40, y: cy - 50, raio: 30, cor: null });

        // Asa inferior esquerda
        areas.push({ tipo: 'circulo', x: cx - 55, y: cy + 25, raio: 40, cor: null });
        areas.push({ tipo: 'circulo', x: cx - 35, y: cy + 35, raio: 25, cor: null });
        
        // Asa inferior direita
        areas.push({ tipo: 'circulo', x: cx + 55, y: cy + 25, raio: 40, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 35, y: cy + 35, raio: 25, cor: null });

        // Detalhes das asas (bolinhas pequenas)
        areas.push({ tipo: 'circulo', x: cx - 60, y: cy - 40, raio: 12, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 60, y: cy - 40, raio: 12, cor: null });
        areas.push({ tipo: 'circulo', x: cx - 55, y: cy + 25, raio: 10, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 55, y: cy + 25, raio: 10, cor: null });

        // Antenas (pequenos círculos no topo)
        areas.push({ tipo: 'circulo', x: cx - 8, y: cy - 50, raio: 6, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 8, y: cy - 50, raio: 6, cor: null });

        return areas;
      },
    },

    peixe: {
      nome: 'Peixe',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Corpo principal (círculo grande)
        areas.push({ tipo: 'circulo', x: cx, y: cy, raio: 60, cor: null });

        // Cauda (triângulo)
        areas.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 60, y: cy },
            { x: cx - 100, y: cy - 35 },
            { x: cx - 100, y: cy + 35 },
          ],
          cor: null,
        });

        // Nadadeira superior
        areas.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 10, y: cy - 60 },
            { x: cx + 10, y: cy - 60 },
            { x: cx, y: cy - 90 },
          ],
          cor: null,
        });

        // Nadadeira inferior
        areas.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 5, y: cy + 60 },
            { x: cx + 15, y: cy + 60 },
            { x: cx + 5, y: cy + 85 },
          ],
          cor: null,
        });

        // Olho (círculo branco com pupila)
        areas.push({ tipo: 'circulo', x: cx + 30, y: cy - 15, raio: 15, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 35, y: cy - 15, raio: 7, cor: null });

        // Escamas decorativas (círculos pequenos)
        areas.push({ tipo: 'circulo', x: cx - 20, y: cy - 20, raio: 12, cor: null });
        areas.push({ tipo: 'circulo', x: cx - 20, y: cy + 10, raio: 12, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 5, y: cy - 5, raio: 12, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 5, y: cy + 25, raio: 12, cor: null });

        // Boca (pequeno círculo)
        areas.push({ tipo: 'circulo', x: cx + 55, y: cy + 5, raio: 8, cor: null });

        return areas;
      },
    },

    arvore: {
      nome: 'Árvore',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Tronco (retângulo)
        areas.push({ tipo: 'retangulo', x: cx - 15, y: cy + 20, w: 30, h: 90, cor: null });

        // Copa da árvore (3 camadas de círculos)
        // Camada inferior
        areas.push({ tipo: 'circulo', x: cx - 50, y: cy + 30, raio: 35, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy + 35, raio: 40, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 50, y: cy + 30, raio: 35, cor: null });

        // Camada média
        areas.push({ tipo: 'circulo', x: cx - 40, y: cy - 10, raio: 38, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 40, y: cy - 10, raio: 38, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy - 5, raio: 42, cor: null });

        // Camada superior
        areas.push({ tipo: 'circulo', x: cx - 25, y: cy - 45, raio: 32, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 25, y: cy - 45, raio: 32, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy - 55, raio: 35, cor: null });

        // Frutas/maçãs (círculos pequenos vermelhos)
        areas.push({ tipo: 'circulo', x: cx - 35, y: cy - 25, raio: 10, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 30, y: cy - 20, raio: 10, cor: null });
        areas.push({ tipo: 'circulo', x: cx - 10, y: cy + 5, raio: 10, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 15, y: cy + 15, raio: 10, cor: null });

        // Grama na base (semicírculos)
        areas.push({ tipo: 'circulo', x: cx - 40, y: cy + 110, raio: 15, cor: null });
        areas.push({ tipo: 'circulo', x: cx, y: cy + 110, raio: 15, cor: null });
        areas.push({ tipo: 'circulo', x: cx + 40, y: cy + 110, raio: 15, cor: null });

        return areas;
      },
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = Math.min(500, window.innerWidth - 60);
    canvas.height = 400;

    const desenhoAtual = desenhos[desenho];
    if (desenhoAtual) {
      const novasRegioes = desenhoAtual.criar(canvas.width, canvas.height);
      setRegioes(novasRegioes);
    }
  }, [desenho]);

  useEffect(() => {
    desenharTudo();
  }, [regioes]);

  const desenharTudo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    regioes.forEach((regiao) => {
      ctx.fillStyle = regiao.cor || '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;

      if (regiao.tipo === 'circulo') {
        ctx.beginPath();
        ctx.arc(regiao.x, regiao.y, regiao.raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (regiao.tipo === 'retangulo') {
        ctx.fillRect(regiao.x, regiao.y, regiao.w, regiao.h);
        ctx.strokeRect(regiao.x, regiao.y, regiao.w, regiao.h);
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

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = regioes.length - 1; i >= 0; i--) {
      const regiao = regioes[i];
      let dentro = false;

      if (regiao.tipo === 'circulo') {
        const dx = x - regiao.x;
        const dy = y - regiao.y;
        dentro = Math.sqrt(dx * dx + dy * dy) <= regiao.raio;
      } else if (regiao.tipo === 'retangulo') {
        dentro =
          x >= regiao.x &&
          x <= regiao.x + regiao.w &&
          y >= regiao.y &&
          y <= regiao.y + regiao.h;
      } else if (regiao.tipo === 'triangulo') {
        dentro = pontoNoTriangulo(
          { x, y },
          regiao.pontos[0],
          regiao.pontos[1],
          regiao.pontos[2]
        );
      }

      if (dentro) {
        const novasRegioes = [...regioes];
        novasRegioes[i] = { ...regiao, cor };
        setRegioes(novasRegioes);
        break;
      }
    }
  };

  const pontoNoTriangulo = (p, a, b, c) => {
    const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y));
    const area1 = Math.abs((p.x - b.x) * (c.y - b.y) - (c.x - b.x) * (p.y - b.y));
    const area2 = Math.abs((a.x - p.x) * (c.y - p.y) - (c.x - p.x) * (a.y - p.y));
    const area3 = Math.abs((a.x - b.x) * (p.y - b.y) - (p.x - b.x) * (a.y - b.y));
    return Math.abs(area - (area1 + area2 + area3)) < 1;
  };

  const limpar = () => {
    if (!window.confirm('Resetar cores?')) return;
    const novasRegioes = regioes.map((r) => ({ ...r, cor: null }));
    setRegioes(novasRegioes);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>Colorindo: {desenhos[desenho]?.nome || desenho}</h3>

      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} style={styles.canvas} onClick={handleClick} />
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