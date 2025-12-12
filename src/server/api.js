require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// --- DADOS NA MEMÓRIA ---
// Usuários de teste (Sempre funcionam)
const usuarios = [
  { id: 1, nome: 'Admin', email: 'admin@teste.com', senha: '123' },
  { id: 2, nome: 'Cliente', email: 'cliente@teste.com', senha: '123' },
  { id: 3, nome: 'Matheus', email: 'matheus@email.com', senha: '123' },
  { id: 4, nome: 'Guilherme', email: 'guilherme@email.com', senha: '123' },
  { id: 5, nome: 'silksong', email: 'silksong@email.com', senha: '123' }
];
const reservas = [];

// --- CARDÁPIO COMPLETO COM IMAGENS REAIS ---
const menu = [
  // --- PRATOS PRINCIPAIS ---
  {
    id: 1,
    nome: "Bife Ancho Premium",
    descricao: "Corte nobre (300g) grelhado na brasa, acompanha risoto de parmesão e chimichurri artesanal.",
    preco: 89.90,
    // Imagem nova de Bife Grelhado
    imagem: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nome: "Salmão ao Molho de Maracujá",
    descricao: "Filé de salmão fresco grelhado, servido com legumes sautée na manteiga de ervas.",
    preco: 75.50,
    imagem: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nome: "Fettuccine Trufado",
    descricao: "Massa fresca artesanal com creme de cogumelos selvagens, azeite de trufas brancas e lascas de grana padano.",
    preco: 68.00,
    imagem: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    nome: "Ossobuco com Polenta",
    descricao: "Cozido lentamente por 12 horas em vinho tinto, servido sobre polenta cremosa mole.",
    preco: 82.00,
    imagem: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },

  // --- LANCHES GOURMET ---
  {
    id: 5,
    nome: "Gold Burger",
    descricao: "Blend de Wagyu (180g), queijo brie empanado, geleia de pimenta e rúcula no pão brioche.",
    preco: 52.00,
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    nome: "Sanduíche de Costela",
    descricao: "Costela desfiada ao molho barbecue caseiro, cebola crispy e queijo cheddar no pão ciabatta.",
    preco: 45.00,
    imagem: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },

  // --- ENTRADAS ---
  {
    id: 7,
    nome: "Bruschetta Pomodoro",
    descricao: "Pão de fermentação natural tostado, tomates confitados, manjericão fresco e glaze de balsâmico.",
    preco: 32.00,
    // Imagem nova de Bruschetta
    imagem: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    nome: "Carpaccio Clássico",
    descricao: "Lâminas finíssimas de carne, alcaparras, parmesão, rúcula e molho de mostarda e mel.",
    preco: 48.00,
    imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },

  // --- SOBREMESAS ---
  {
    id: 9,
    nome: "Petit Gâteau",
    descricao: "Bolo de chocolate belga cremoso com sorvete de baunilha de Madagascar.",
    preco: 32.00,
    imagem: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    nome: "Cheesecake de Frutas Vermelhas",
    descricao: "Base de biscoito, creme de queijo suave e calda rústica de morango e amora.",
    preco: 28.00,
    imagem: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
  },

  // --- BEBIDAS ---
  {
    id: 11,
    nome: "Gin Tônica Botânico",
    descricao: "Gin importado, tônica artesanal, pepino, zimbro e alecrim defumado.",
    preco: 35.00,
    imagem: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    nome: "Vinho Tinto Cabernet",
    descricao: "Taça de vinho chileno reserva, notas de frutas negras e madeira.",
    preco: 25.00,
    imagem: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  }
];

// Configuração
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'segredo-tcc',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, '../../public')));

// --- ROTAS ---

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  const user = usuarios.find(u => u.email === email && u.senha === senha);
  if (!user) return res.status(401).json({ error: 'Dados incorretos.' });
  req.session.user = user;
  res.json({ ok: true, user });
});

// Cadastro
app.post('/api/auth/register', (req, res) => {
  const { nome, email, senha } = req.body;
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ error: 'E-mail já existe.' });
  }
  const novoUser = { id: Date.now(), nome, email, senha };
  usuarios.push(novoUser);
  res.json({ ok: true });
});


app.get('/api/auth/status', (req, res) => {
  res.json({ logado: !!req.session.user, user: req.session.user || null });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// Menu
app.get('/api/menu', (req, res) => res.json(menu));

app.post('/api/reservas', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Login necessário.' });
  const novaReserva = {
    id: Date.now(),
    usuarioId: req.session.user.id,
    ...req.body,
    status: 'pendente'
  };
  reservas.push(novaReserva);
  res.json({ ok: true });
});

app.get('/api/minhas-reservas', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Login necessário.' });
  const minhas = reservas.filter(r => r.usuarioId === req.session.user.id);
  res.json(minhas);
});

module.exports = app;