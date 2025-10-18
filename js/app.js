const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (site)
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  const user = {
    email: 'admin@paralanches.com',
    senha: '123456',
    nome: 'Administrador'
  };

  if (email === user.email && senha === user.senha) {
    return res.json({ ok: true, message: `Bem-vindo, ${user.nome}!`, user: { email: user.email, nome: user.nome } });
  }

  return res.status(401).json({ error: 'E-mail ou senha inválidos' });
});

module.exports = app;
