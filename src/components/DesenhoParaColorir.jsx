// src/components/DesenhoParaColorir.jsx - VERSÃO FUNCIONAL

import { useRef, useEffect, useState } from 'react';

const COLORS = {
  background: '#FFFFFF',
  border: '#000000',
  text: '#000000',
  textLight: '#FFFFFF',
  danger: '#DC3545',
  textSecondary: '#333333',
};

const SIZES = {
  spacing: { xs: 8, small: 12, medium: 20, large: 30 },
  fontSize: { small: 18, medium: 22, large: 28 },
  borderRadius: 15,
  borderWidth: 3,
};

export default function DesenhoParaColorir({ desenho, cor, onVoltar }) {
  const canvasRef = useRef(null);
  const [regioes, setRegioes] = useState([]);

  // Desenhos simplificados com áreas clicáveis
  const desenhos = {
    flor: {
      nome: 'Flor',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Centro amarelo
        areas.push({
          tipo: 'circulo',
          x: cx,
          y: cy,
          raio: 30,
          cor: null,
        });

        // 6 Pétalas rosa ao redor
        for (let i = 0; i < 6; i++) {
          const angulo = (Math.PI * 2 * i) / 6;
          const px = cx + Math.cos(angulo) * 60;
          const py = cy + Math.sin(angulo) * 60;
          
          areas.push({
            tipo: 'circulo',
            x: px,
            y: py,
            raio: 35,
            cor: null,
          });
        }

        // Caule verde
        areas.push({
          tipo: 'retangulo',
          x: cx - 8,
          y: cy + 25,
          w: 16,
          h: 90,
          cor: null,
        });

        // Folha esquerda
        areas.push({
          tipo: 'circulo',
          x: cx - 25,
          y: cy + 70,
          raio: 18,
          cor: null,
        });

        // Folha direita
        areas.push({
          tipo: 'circulo',
          x: cx + 25,
          y: cy + 85,
          raio: 18,
          cor: null,
        });

        return areas;
      },
    },

    casa: {
      nome: 'Casa',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Paredes
        areas.push({
          tipo: 'retangulo',
          x: cx - 70,
          y: cy,
          w: 140,
          h: 100,
          cor: null,
        });

        // Telhado
        areas.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 80, y: cy },
            { x: cx, y: cy - 60 },
            { x: cx + 80, y: cy },
          ],
          cor: null,
        });

        // Porta
        areas.push({
          tipo: 'retangulo',
          x: cx - 18,
          y: cy + 40,
          w: 36,
          h: 60,
          cor: null,
        });

        // Janela esquerda
        areas.push({
          tipo: 'retangulo',
          x: cx - 55,
          y: cy + 25,
          w: 28,
          h: 28,
          cor: null,
        });

        // Janela direita
        areas.push({
          tipo: 'retangulo',
          x: cx + 27,
          y: cy + 25,
          w: 28,
          h: 28,
          cor: null,
        });

        // Chaminé
        areas.push({
          tipo: 'retangulo',
          x: cx + 35,
          y: cy - 45,
          w: 18,
          h: 45,
          cor: null,
        });

        return areas;
      },
    },

    coracao: {
      nome: 'Coração',
      criar: (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const areas = [];

        // Coração central (aproximado com círculos)
        areas.push({
          tipo: 'circulo',
          x: cx - 25,
          y: cy - 15,
          raio: 40,
          cor: null,
        });

        areas.push({
          tipo: 'circulo',
          x: cx + 25,
          y: cy - 15,
          raio: 40,
          cor: null,
        });

        areas.push({
          tipo: 'triangulo',
          pontos: [
            { x: cx - 55, y: cy + 5 },
            { x: cx + 55, y: cy + 5 },
            { x: cx, y: cy + 75 },
          ],
          cor: null,
        });

        // Mini corações decorativos
        areas.push({
          tipo: 'circulo',
          x: cx - 70,
          y: cy - 40,
          raio: 20,
          cor: null,
        });

        areas.push({
          tipo: 'circulo',
          x: cx + 70,
          y: cy - 40,
          raio: 20,
          cor: null,
        });

        areas.push({
          tipo: 'circulo',
          x: cx - 55,
          y: cy + 60,
          raio: 18,
          cor: null,
        });

        areas.push({
          tipo: 'circulo',
          x: cx + 55,
          y: cy + 60,
          raio: 18,
          cor: null,
        });

        return areas;
      },
    },
  };

  // Inicializar canvas
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

  // Redesenhar quando regiões mudam
  useEffect(() => {
    desenharTudo();
  }, [regioes]);

  const desenharTudo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar cada região
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

  // Detectar clique
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('Clique em:', x, y); // Debug

    // Verificar de trás para frente
    for (let i = regioes.length - 1; i >= 0; i--) {
      const regiao = regioes[i];
      let dentro = false;

      if (regiao.tipo === 'circulo') {
        const dx = x - regiao.x;
        const dy = y - regiao.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        dentro = distancia <= regiao.raio;
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
        console.log('Região clicada:', i, regiao.tipo); // Debug
        
        // Atualizar cor da região
        const novasRegioes = [...regioes];
        novasRegioes[i] = { ...regiao, cor };
        setRegioes(novasRegioes);
        break;
      }
    }
  };

  // Verificar se ponto está dentro do triângulo
  const pontoNoTriangulo = (p, a, b, c) => {
    const area = Math.abs(
      (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
    );
    const area1 = Math.abs(
      (p.x - b.x) * (c.y - b.y) - (c.x - b.x) * (p.y - b.y)
    );
    const area2 = Math.abs(
      (a.x - p.x) * (c.y - p.y) - (c.x - p.x) * (a.y - p.y)
    );
    const area3 = Math.abs(
      (a.x - b.x) * (p.y - b.y) - (p.x - b.x) * (a.y - b.y)
    );
    return Math.abs(area - (area1 + area2 + area3)) < 1;
  };

  const limpar = () => {
    if (!window.confirm('Resetar cores?')) return;
    const novasRegioes = regioes.map((r) => ({ ...r, cor: null }));
    setRegioes(novasRegioes);
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