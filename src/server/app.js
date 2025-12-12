const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../../public')));

// ROTA API: Ler o arquivo JSON e enviar para o frontend
app.get('/api/menu', (req, res) => {
    const filePath = path.join(__dirname, '../../data/menu.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler JSON:", err);
            return res.status(500).json({ error: 'Erro ao carregar cardápio' });
        }
        res.json(JSON.parse(data));
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = app;