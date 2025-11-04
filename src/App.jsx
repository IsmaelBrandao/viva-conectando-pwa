// src/App.jsx

import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import PinturaScreen from './screens/PinturaScreen';
import MemoriaScreen from './screens/MemoriaScreen';

function App() {
  const [telaAtual, setTelaAtual] = useState('home');

  const navegar = (tela) => {
    setTelaAtual(tela);
  };

  const voltarHome = () => {
    setTelaAtual('home');
  };

  const renderizarTela = () => {
    switch (telaAtual) {
      case 'home':
        return <HomeScreen onNavigate={navegar} />;
      
      case 'pintura':
        return <PinturaScreen onVoltar={voltarHome} />;
      
      case 'memoria':
        return <MemoriaScreen onVoltar={voltarHome} />;
      
      case 'caca-palavras':
        return (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <h1>🔍 Caça-Palavras</h1>
            <p>Em breve...</p>
            <button onClick={voltarHome} style={{ padding: 20, fontSize: 18 }}>
              Voltar
            </button>
          </div>
        );
      
      default:
        return <HomeScreen onNavigate={navegar} />;
    }
  };

  return renderizarTela();
}

export default App;