require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'restaurante-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção, mudar para true se usar HTTPS
}));

// Servir arquivos estáticos (site)
app.use(express.static(path.join(__dirname, '../../')));

// Usuários predefinidos
const users = [
    {
        id: 1,
        nome: 'Matheus',
        email: 'matheus@email.com',
        senha: 'Matheus123'
    },
    {
        id: 2,
        nome: 'Guilherme',
        email: 'guilherme@email.com',
        senha: 'Guilherme123'
    }
];

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body || {};
    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = users.find(u => u.email === email && u.senha === senha);
    
    if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    // Remove a senha antes de enviar
    const { senha: _, ...userWithoutPassword } = user;
    
    // Salva o usuário na sessão
    req.session.user = userWithoutPassword;
    
    res.json({ 
        ok: true, 
        message: `Bem-vindo, ${user.nome}!`, 
        user: userWithoutPassword 
    });
});

// Rota para verificar autenticação
app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ ok: true, user: req.session.user });
    } else {
        res.status(401).json({ error: 'Não autenticado' });
    }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ ok: true, message: 'Logout realizado com sucesso' });
});

module.exports = app;
