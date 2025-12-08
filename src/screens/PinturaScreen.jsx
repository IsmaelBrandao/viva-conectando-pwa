// src/screens/PinturaScreen.jsx
import React, { useRef, useEffect, useState } from 'react';
import { COLORS, SIZES } from '../styles/colors';
import DesenhoParaColorir from '../components/DesenhoParaColorir';
import BotaoAjuda from '../components/BotaoAjuda';

export default function PinturaScreen({ onVoltar }) {
  const canvasRef = useRef(null);
  const [corSelecionada, setCorSelecionada] = useState(COLORS.paint.preto);
  const [espessura, setEspessura] = useState(10);
  const [desenhando, setDesenhando] = useState(false);
  const [modo, setModo] = useState('menu');
  const [desenhoEscolhido, setDesenhoEscolhido] = useState(null);
  const [ferramenta, setFerramenta] = useState('pincel');
  const [historico, setHistorico] = useState([]);

  // Paleta de Cores
  const cores = [
    { nome: 'Preto', cor: '#000000' },
    { nome: 'Vermelho', cor: '#FF0000' },
    { nome: 'Laranja', cor: '#FF8C00' },
    { nome: 'Amarelo', cor: '#FFD700' },
    { nome: 'Verde', cor: '#008000' },
    { nome: 'Azul', cor: '#0000FF' },
    { nome: 'Roxo', cor: '#800080' },
    { nome: 'Rosa', cor: '#FF69B4' },
    { nome: 'Marrom', cor: '#8B4513' },
    { nome: 'Cinza', cor: '#808080' },
    { nome: 'Branco', cor: '#FFFFFF' },
  ];

  // Configuração do Canvas no Modo Livre
  useEffect(() => {
    if (modo === 'livre') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth - 20;
      // Altura responsiva (60% da tela) para não esconder ferramentas
      canvas.height = window.innerHeight * 0.60; 
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      salvarEstado(canvas);
    }
  }, [modo]);

  // --- FUNÇÕES DE SEGURANÇA E SOCIAL ---

  // Proteção ao Voltar (Evita perder o desenho)
  const voltarSeguro = (destino) => {
    // Se tiver histórico (fez algum risco), pergunta antes
    if (historico.length > 1) {
      if (window.confirm("Se você sair agora, vai perder seu desenho. Tem certeza?")) {
        if (destino === 'menu') setModo('menu');
        else onVoltar();
      }
    } else {
      // Se não desenhou nada, sai direto
      if (destino === 'menu') setModo('menu');
      else onVoltar();
    }
  };

  // Salvar Inteligente (Tenta compartilhar direto)
  const compartilharArte = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Tenta usar o compartilhamento nativo do celular
    if (navigator.share) {
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'minha-arte-viva-conectado.png', { type: 'image/png' });
        try {
          await navigator.share({
            files: [file],
            title: 'Minha Arte',
            text: 'Olha o desenho que eu fiz no Viva Conectado! 🎨'
          });
        } catch (error) {
          console.log('Compartilhamento cancelado ou falhou', error);
        }
      });
    } else {
      // 2. Fallback: Se for PC ou não suportar, baixa o arquivo
      const link = document.createElement('a');
      link.download = 'meu-desenho.png';
      link.href = canvas.toDataURL();
      link.click();
      alert("Desenho salvo na sua galeria/downloads! 📸");
    }
  };

  // --- FUNÇÕES DE DESENHO (MANTIDAS) ---
  const salvarEstado = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistorico(prev => [...prev.slice(-10), imageData]);
  };

  const desfazer = () => {
    const canvas = canvasRef.current;
    if (!canvas || historico.length === 0) return;
    const ctx = canvas.getContext('2d');
    const novoHistorico = [...historico];
    novoHistorico.pop();
    const estadoAnterior = novoHistorico[novoHistorico.length - 1];
    if (estadoAnterior) {
      ctx.putImageData(estadoAnterior, 0, 0);
      setHistorico(novoHistorico);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHistorico([]);
    }
  };

  const obterCoordenadas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clienteX = e.touches ? e.touches[0].clientX : e.clientX;
    const clienteY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clienteX - rect.left, y: clienteY - rect.top };
  };

  const iniciarDesenho = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    salvarEstado(canvas);
    const ctx = canvas.getContext('2d');
    const { x, y } = obterCoordenadas(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = ferramenta === 'borracha' ? '#FFFFFF' : corSelecionada;
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

  const alternarEspessura = () => {
    if (espessura === 5) setEspessura(10);
    else if (espessura === 10) setEspessura(20);
    else setEspessura(5);
  };

  // --- RENDERIZAÇÃO ---

  // 1. MENU
  if (modo === 'menu') {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>🎨 Pintura</h1>
          <p style={styles.subtitulo}>O que vamos fazer hoje?</p>
        </header>
        <main style={styles.main}>
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.primary }} onClick={() => setModo('livre')}>
            <span style={styles.iconeGrande}>✏️</span>
            <span style={styles.textoGrande}>DESENHO LIVRE</span>
          </button>
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.secondary }} onClick={() => setModo('colorir')}>
            <span style={styles.iconeGrande}>🖍️</span>
            <span style={styles.textoGrande}>COLORIR DESENHOS</span>
          </button>
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.textSecondary }} onClick={onVoltar}>
            <span style={styles.iconeGrande}>⬅️</span>
            <span style={styles.textoGrande}>VOLTAR</span>
          </button>
        </main>
        <BotaoAjuda texto="Escolha 'Desenho Livre' para desenhar em uma folha em branco, ou 'Colorir Desenhos' para pintar figuras prontas." />
      </div>
    );
  }

  // 2. ESCOLHA DE DESENHO
  if (modo === 'colorir' && !desenhoEscolhido) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={() => setModo('menu')} style={styles.btnVoltarHeader}>⬅️ Voltar</button>
          <h1 style={styles.titulo}>Escolha o Desenho</h1>
          <div style={{width: 60}}></div>
        </header>
        <main style={styles.main}>
          {/* Adicione mais desenhos aqui conforme baixar as imagens */}
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.success }} 
            onClick={() => setDesenhoEscolhido({ nome: 'Mandala', caminho: '/desenhos/mandala.png' })}>
            <span style={styles.iconeGrande}>🌸</span><span style={styles.textoGrande}>MANDALA</span>
          </button>
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.primary }} 
            onClick={() => setDesenhoEscolhido({ nome: 'Gatinho', caminho: '/desenhos/gato.png' })}>
            <span style={styles.iconeGrande}>🐱</span><span style={styles.textoGrande}>GATINHO</span>
          </button>
          <button style={{ ...styles.botaoGrande, backgroundColor: COLORS.warning }} 
            onClick={() => setDesenhoEscolhido({ nome: 'Flores', caminho: '/desenhos/flor.png' })}>
            <span style={styles.iconeGrande}>🌻</span><span style={styles.textoGrande}>FLORES</span>
          </button>
        </main>
        <BotaoAjuda texto="Toque em uma das opções para escolher qual desenho você quer pintar." />
      </div>
    );
  }

  // 3. TELA DE COLORIR (Flood Fill)
  if (modo === 'colorir' && desenhoEscolhido) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={() => setDesenhoEscolhido(null)} style={styles.btnVoltarHeader}>⬅️ Voltar</button>
          <h1 style={styles.titulo}>Pintando</h1>
          <div style={{width: 60}}></div>
        </header>

        <main style={styles.mainJogo}>
          <DesenhoParaColorir
            desenho={desenhoEscolhido}
            cor={ferramenta === 'borracha' ? '#FFFFFF' : corSelecionada}
            onVoltar={() => setDesenhoEscolhido(null)}
          />

          <div style={styles.painelControle}>
            <div style={styles.linhaBotoes}>
              <button 
                style={{...styles.btnFerramenta, backgroundColor: ferramenta === 'pincel' ? COLORS.primary : '#E0E0E0', color: ferramenta === 'pincel'?'#FFF':'#333'}} 
                onClick={() => setFerramenta('pincel')}>
                🖌️ Pincel
              </button>
              <button 
                style={{...styles.btnFerramenta, backgroundColor: ferramenta === 'borracha' ? COLORS.primary : '#E0E0E0', color: ferramenta === 'borracha'?'#FFF':'#333'}} 
                onClick={() => setFerramenta('borracha')}>
                🧽 Borracha
              </button>
            </div>

            <div style={styles.scrollCores}>
              {cores.map((item) => (
                <button
                  key={item.nome}
                  style={{
                    ...styles.corBotao,
                    backgroundColor: item.cor,
                    border: (corSelecionada === item.cor && ferramenta === 'pincel') ? '4px solid #000' : '2px solid #CCC',
                    transform: (corSelecionada === item.cor && ferramenta === 'pincel') ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onClick={() => {
                    setCorSelecionada(item.cor);
                    setFerramenta('pincel');
                  }}
                />
              ))}
            </div>
          </div>
        </main>
        <BotaoAjuda texto="Toque numa cor abaixo e depois toque no desenho para pintar." />
      </div>
    );
  }

  // 4. MODO LIVRE
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        {/* USANDO A NOVA FUNÇÃO DE VOLTAR SEGURO */}
        <button onClick={() => voltarSeguro('menu')} style={styles.btnVoltarHeader}>⬅️ Sair</button>
        <h1 style={styles.titulo}>Livre</h1>
        {/* USANDO O NOVO COMPARTILHAR */}
        <button style={styles.btnSalvarHeader} onClick={compartilharArte}>💾 Enviar</button>
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

        <div style={styles.painelControle}>
          <div style={styles.linhaBotoes}>
            <button style={styles.btnAcao} onClick={desfazer}>↩️ Desfazer</button>
            
            <button style={{...styles.btnAcao, width: 80}} onClick={alternarEspessura}>
               ⚫ {espessura === 5 ? 'Fino' : espessura === 10 ? 'Médio' : 'Grosso'}
            </button>

            <button 
              style={{...styles.btnAcao, backgroundColor: ferramenta === 'borracha' ? '#FFCDD2' : '#FFF'}} 
              onClick={() => setFerramenta(ferramenta === 'borracha' ? 'pincel' : 'borracha')}>
              {ferramenta === 'borracha' ? '🧽 Usando' : '🧽 Apagar'}
            </button>
          </div>

          <div style={styles.scrollCores}>
            {cores.map((item) => (
              <button
                key={item.nome}
                style={{
                  ...styles.corBotao,
                  backgroundColor: item.cor,
                  border: (corSelecionada === item.cor && ferramenta === 'pincel') ? '4px solid #000' : '2px solid #CCC',
                  transform: (corSelecionada === item.cor && ferramenta === 'pincel') ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => {
                  setCorSelecionada(item.cor);
                  setFerramenta('pincel');
                }}
              />
            ))}
          </div>
        </div>
      </main>
      <BotaoAjuda texto="Desenhe livremente! Use os botões abaixo para mudar a cor, apagar ou desfazer." />
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F0F4F8', display: 'flex', flexDirection: 'column' },
  header: { 
    backgroundColor: COLORS.primary, padding: '15px 10px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 10 
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#FFF', margin: 0, flex: 1 },
  subtitulo: { fontSize: 18, color: '#E0E0E0', marginTop: 5 },
  
  btnVoltarHeader: { 
    backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid #FFF', color: '#FFF', 
    borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' 
  },
  btnSalvarHeader: { 
    backgroundColor: COLORS.success, border: 'none', color: '#FFF', 
    borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' 
  },

  main: { flex: 1, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 },
  mainJogo: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },

  botaoGrande: { 
    width: '100%', maxWidth: 350, padding: 25, borderRadius: 20, border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 20, 
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'transform 0.1s'
  },
  iconeGrande: { fontSize: 40 },
  textoGrande: { fontSize: 22, fontWeight: 'bold', color: '#FFF', textAlign: 'left' },

  canvasContainer: { 
    flex: 1,
    margin: 10,
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    border: '2px solid #DDD', 
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },
  canvas: { touchAction: 'none' },

  painelControle: {
    backgroundColor: '#FFF',
    padding: '15px 10px',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 15
  },
  linhaBotoes: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: 10
  },
  btnAcao: {
    flex: 1,
    padding: '12px 5px',
    borderRadius: 12,
    border: '2px solid #DDD',
    backgroundColor: '#F9F9F9',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
  },
  btnFerramenta: {
    flex: 1, padding: 12, borderRadius: 12, border: 'none',
    fontSize: 18, fontWeight: 'bold', cursor: 'pointer'
  },

  scrollCores: {
    display: 'flex',
    overflowX: 'auto', 
    gap: 12,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5
  },
  corBotao: {
    minWidth: 50, height: 50,
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  }
};