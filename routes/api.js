const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const validation = require('../middleware/validation');

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // limite de 100 requisições por IP
});

router.use(apiLimiter);

// Aplicar validações
validation(router);

// Simulação de banco de dados
let reservas = [];
let avaliacoes = [];

// Endpoint para criar uma nova reserva
router.post('/reservas', (req, res) => {
    const { nome, email, data, horario, pessoas } = req.body;
    
    if (!nome || !email || !data || !horario || !pessoas) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const reserva = {
        id: Date.now(),
        nome,
        email,
        data,
        horario,
        pessoas,
        status: 'pendente'
    };

    reservas.push(reserva);
    res.status(201).json({ message: 'Reserva criada com sucesso', reserva });
});

// Endpoint para buscar reservas
router.get('/reservas', (req, res) => {
    res.json(reservas);
});

// Endpoint para criar uma nova avaliação
router.post('/avaliacoes', (req, res) => {
    const { nome, nota, comentario, pratoId } = req.body;
    
    if (!nome || !nota || !pratoId) {
        return res.status(400).json({ message: 'Nome, nota e prato são obrigatórios' });
    }

    const avaliacao = {
        id: Date.now(),
        nome,
        nota,
        comentario,
        pratoId,
        data: new Date().toISOString()
    };

    avaliacoes.push(avaliacao);
    res.status(201).json({ message: 'Avaliação enviada com sucesso', avaliacao });
});

// Endpoint para buscar avaliações de um prato
router.get('/avaliacoes/:pratoId', (req, res) => {
    const { pratoId } = req.params;
    const avaliacoesPrato = avaliacoes.filter(a => a.pratoId === parseInt(pratoId));
    res.json(avaliacoesPrato);
});

module.exports = router;