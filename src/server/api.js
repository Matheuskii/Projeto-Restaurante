require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises; // Usar promises para ler arquivos

const app = express();

// --- CONFIGURAÇÕES ---
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(session({
    secret: 'segredo-do-restaurante-tcc',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Servir arquivos estáticos (HTML, CSS, JS, Imagens)
// O 'public' é a raiz do site agora.
app.use(express.static(path.join(__dirname, '../../public')));

// --- FUNÇÕES AUXILIARES (LER/GRAVAR JSON) ---
const DATA_DIR = path.join(__dirname, '../../data');

async function lerJSON(arquivo) {
    try {
        const data = await fs.readFile(path.join(DATA_DIR, arquivo), 'utf8');
        return JSON.parse(data);
    } catch (erro) {
        return []; // Se der erro ou arquivo não existir, retorna array vazio
    }
}

async function gravarJSON(arquivo, dados) {
    await fs.writeFile(path.join(DATA_DIR, arquivo), JSON.stringify(dados, null, 2));
}

// --- ROTAS DE DADOS (API) ---

// 1. Rota do Cardápio (Lê menu.json)
app.get('/api/menu', async (req, res) => {
    const menu = await lerJSON('menu.json');
    res.json(menu);
});

// 2. Login (Lê usuarios.json)
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuarios = await lerJSON('usuarios.json');

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    req.session.user = { id: user.id, nome: user.nome, email: user.email };
    res.json({ ok: true, message: 'Login realizado!', user: req.session.user });
});

// 3. Cadastro (Grava em usuarios.json)
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;
    const usuarios = await lerJSON('usuarios.json');

    if (usuarios.find(u => u.email === email)) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const novoUsuario = { id: Date.now(), nome, email, senha };
    usuarios.push(novoUsuario);
    await gravarJSON('usuarios.json', usuarios);

    res.json({ ok: true, message: 'Cadastro realizado com sucesso!' });
});

// 4. Check Auth (Verifica se está logado)
app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ logado: true, user: req.session.user });
    } else {
        res.json({ logado: false });
    }
});

// 5. Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ ok: true });
});

// 6. Criar Reserva (Grava em reservas.json)
app.post('/api/reservas', async (req, res) => {
    const { nome, email, data, horario, pessoas, telefone, preferencia, observacoes } = req.body;
    
    // Validação básica
    if(!nome || !data || !pessoas) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const reservas = await lerJSON('reservas.json');
    
    const novaReserva = {
        id: Date.now(),
        usuarioId: req.session.user ? req.session.user.id : null, // Vincula ao usuário se logado
        nome, email, telefone, data, horario, pessoas, preferencia, observacoes,
        status: 'pendente'
    };

    reservas.push(novaReserva);
    await gravarJSON('reservas.json', reservas);

    res.status(201).json({ ok: true, message: 'Reserva solicitada!', reserva: novaReserva });
});

// 7. Listar Minhas Reservas (Lê reservas.json)
app.get('/api/reservas', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Não autorizado' });

    const reservas = await lerJSON('reservas.json');
    // Filtra apenas as reservas do usuário logado (pelo email ou ID)
    const minhasReservas = reservas.filter(r => r.email === req.session.user.email);
    
    res.json(minhasReservas);
});

// 8. Avaliações (Lê e Grava avaliacoes.json)
app.post('/api/avaliacoes/:pratoId', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ mensaje: 'Faça login para avaliar.' });

    const { nota, descricao } = req.body;
    const pratoId = req.params.pratoId;
    
    const avaliacoes = await lerJSON('avaliacoes.json');
    
    const novaAvaliacao = {
        id: Date.now(),
        pratoId,
        usuario: req.session.user.nome,
        nota,
        descricao,
        data: new Date().toISOString()
    };

    avaliacoes.push(novaAvaliacao);
    await gravarJSON('avaliacoes.json', avaliacoes);

    res.json({ ok: true });
});

module.exports = app;