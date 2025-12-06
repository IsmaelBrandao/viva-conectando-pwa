// src/utils/bingoLogic.js

export const gerarCartelaBingo = () => {
  const cartela = {
    B: gerarNumeros(1, 15, 5),
    I: gerarNumeros(16, 30, 5),
    N: gerarNumeros(31, 45, 4), // 4 números (meio livre)
    G: gerarNumeros(46, 60, 5),
    O: gerarNumeros(61, 75, 5)
  };
  return cartela;
};

function gerarNumeros(min, max, qtd) {
  const nums = new Set();
  while(nums.size < qtd) {
    nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

export const verificarCartelaCompleta = (cartela, historicoSorteios) => {
  const numerosDaCartela = [
    ...cartela.B, ...cartela.I, ...cartela.N, ...cartela.G, ...cartela.O
  ];
  return numerosDaCartela.every(num => historicoSorteios.includes(num));
};

// --- NOVA FUNÇÃO ---
export const obterLetra = (numero) => {
  if (!numero) return '';
  if (numero <= 15) return 'B';
  if (numero <= 30) return 'I';
  if (numero <= 45) return 'N';
  if (numero <= 60) return 'G';
  return 'O';
};