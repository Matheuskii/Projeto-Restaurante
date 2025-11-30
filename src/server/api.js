require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares simples
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'restaurante-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
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

// ===== LOGIN =====
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = users.find(u => u.email === email && u.senha === senha);
    
    if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    const { senha: _, ...userWithoutPassword } = user;
    req.session.user = userWithoutPassword;
    
    res.json({ 
        ok: true, 
        message: `Bem-vindo, ${user.nome}!`, 
        user: userWithoutPassword 
    });
});

// ===== VERIFICAR AUTENTICAÇÃO =====
app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        return res.json({ logado: true, ok: true, user: req.session.user });
    }
    res.json({ logado: false, ok: false });
});

// ===== LOGOUT =====
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.json({ ok: true, message: 'Logout realizado com sucesso' });
    });
});

// Simulação de banco de dados
let reservas = [];
let avaliacoes = [];

// ===== RESERVAS =====
app.post('/api/reservas', (req, res) => {
    const { nome, email, data, horario, pessoas, telefone, preferencia, observacoes } = req.body;
    
    if (!nome || !email || !data || !horario || !pessoas) {
        return res.status(400).json({ error: 'Preenchimento obrigatório: nome, email, data, horário e pessoas' });
    }

    const reserva = {
        id: Date.now(),
        nome,
        email,
        data,
        horario,
        pessoas,
        telefone: telefone || '',
        preferencia: preferencia || '',
        observacoes: observacoes || '',
        status: 'pendente',
        criada_em: new Date().toISOString()
    };

    reservas.push(reserva);
    res.status(201).json({ ok: true, message: 'Reserva criada com sucesso', reserva });
});

app.get('/api/reservas', (req, res) => {
    res.json(reservas);
});

app.get('/api/reservas/:id', (req, res) => {
    const reserva = reservas.find(r => r.id === parseInt(req.params.id));
    
    if (!reserva) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    res.json(reserva);
});

// ===== AVALIAÇÕES =====
app.post('/api/avaliacoes/:pratoId', (req, res) => {
    const { nota, descricao } = req.body;
    const pratoId = req.params.pratoId;
    
    if (!nota || !pratoId) {
        return res.status(400).json({ mensagem: 'Nota e prato são obrigatórios' });
    }

    if (!req.session.user) {
        return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    const avaliacao = {
        id: Date.now(),
        usuario: req.session.user.nome,
        email: req.session.user.email,
        nota: parseInt(nota),
        descricao: descricao || '',
        pratoId: parseInt(pratoId),
        data: new Date().toISOString()
    };

    avaliacoes.push(avaliacao);
    res.status(201).json({ ok: true, mensagem: 'Avaliação criada com sucesso', avaliacao });
});

app.get('/api/avaliacoes/:pratoId', (req, res) => {
    const pratoId = parseInt(req.params.pratoId);
    const avaliacoesPrato = avaliacoes.filter(a => a.pratoId === pratoId);
    
    res.json(avaliacoesPrato);
});

module.exports = app;
