// src/components/DesenhoParaColorir.jsx
import React, { useRef, useEffect, useState } from 'react';
import { floodFill } from '../utils/floodFill';
import { COLORS } from '../styles/colors';

export default function DesenhoParaColorir({ desenho, cor, onVoltar }) {
  const canvasRef = useRef(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new Image();
    img.src = desenho.caminho;
    
    img.onload = () => {
      // Calcula tamanho para caber perfeitamente
      const containerW = window.innerWidth - 30; // Margem
      const containerH = window.innerHeight * 0.55; // 55% da altura da tela
      
      const scale = Math.min(containerW / img.width, containerH / img.height);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      salvarEstado();
    };
  }, [desenho]);

  const salvarEstado = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistorico(prev => [...prev.slice(-10), imageData]);
  };

  const desfazer = () => {
    const canvas = canvasRef.current;
    if (!canvas || historico.length <= 1) return;

    const ctx = canvas.getContext('2d');
    const novoHistorico = [...historico];
    novoHistorico.pop();
    const estadoAnterior = novoHistorico[novoHistorico.length - 1];

    ctx.putImageData(estadoAnterior, 0, 0);
    setHistorico(novoHistorico);
  };

  const salvarImagem = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `pintura-${desenho.nome}.png`;
    link.href = canvas.toDataURL();
    link.click();
    alert("Salvo! 📸");
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    salvarEstado();
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    floodFill(canvas, x, y, cor);
  };

  const limpar = () => {
    if(!window.confirm("Apagar tudo?")) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = desenho.caminho;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHistorico([]);
        salvarEstado();
    };
  }

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15}}>
      
      {/* Botões de Ação Superiores */}
      <div style={styles.barraAcoes}>
        <button onClick={desfazer} style={styles.btnAcao}>↩️ Desfazer</button>
        <button onClick={limpar} style={{...styles.btnAcao, color: COLORS.danger, borderColor: COLORS.danger}}>🗑️ Limpar</button>
        <button onClick={salvarImagem} style={{...styles.btnAcao, backgroundColor: COLORS.success, color: '#FFF', border:'none'}}>💾 Salvar</button>
      </div>

      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} onClick={handleClick} style={{cursor: 'crosshair', display: 'block'}} />
      </div>
    </div>
  );
}

const styles = {
  barraAcoes: {
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
    width: '100%',
  },
  btnAcao: {
    padding: '10px 15px',
    borderRadius: 12,
    border: '2px solid #DDD',
    backgroundColor: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  canvasContainer: { 
    border: '2px solid #000', 
    borderRadius: 12, 
    overflow: 'hidden', 
    backgroundColor: '#FFF', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
  }
};