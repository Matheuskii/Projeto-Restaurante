// Gerenciamento de reservas e avaliações
document.addEventListener('DOMContentLoaded', () => {
    // Sistema de Reservas
    const formReserva = document.getElementById('form-reserva');
    if (formReserva) {
        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const reserva = {
                nome: document.getElementById('nome-reserva').value,
                email: document.getElementById('email-reserva').value,
                data: document.getElementById('data-reserva').value,
                horario: document.getElementById('horario-reserva').value,
                pessoas: document.getElementById('pessoas-reserva').value
            };

            try {
                const res = await fetch('/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reserva)
                });

                const data = await res.json();
                const msgEl = document.getElementById('mensagem-reserva');
                
                if (res.ok) {
                    msgEl.textContent = 'Reserva realizada com sucesso!';
                    msgEl.style.color = '#bfa46a';
                    formReserva.reset();
                } else {
                    msgEl.textContent = data.message || 'Erro ao fazer reserva';
                    msgEl.style.color = '#ff4444';
                }
            } catch (error) {
                console.error('Erro:', error);
                const msgEl = document.getElementById('mensagem-reserva');
                msgEl.textContent = 'Erro ao conectar com o servidor';
                msgEl.style.color = '#ff4444';
            }
        });
    }

    // Sistema de Avaliações
    const pratos = document.querySelectorAll('.prato');
    pratos.forEach(prato => {
        const estrelas = prato.querySelector('.estrelas');
        const btnAvaliar = prato.querySelector('.btn-avaliar');
        const pratoId = prato.dataset.id;

        if (estrelas && btnAvaliar) {
            // Carregar avaliações existentes
            carregarAvaliacoes(pratoId);

            // Interação com estrelas
            estrelas.addEventListener('mousemove', (e) => {
                const rect = estrelas.getBoundingClientRect();
                const width = rect.width;
                const x = e.clientX - rect.left;
                const nota = Math.ceil((x / width) * 5);
                atualizarEstrelas(estrelas, nota);
            });

            estrelas.addEventListener('mouseleave', () => {
                const notaAtual = parseInt(estrelas.dataset.nota);
                atualizarEstrelas(estrelas, notaAtual);
            });

            // Modal de avaliação
            btnAvaliar.addEventListener('click', () => {
                const modal = criarModalAvaliacao(pratoId);
                document.body.appendChild(modal);
            });
        }
    });
});

// Funções auxiliares
function atualizarEstrelas(elemento, nota) {
    elemento.style.width = `${(nota/5) * 100}%`;
    elemento.dataset.nota = nota;
}

async function carregarAvaliacoes(pratoId) {
    try {
        const res = await fetch(`/api/avaliacoes/${pratoId}`);
        const avaliacoes = await res.json();
        
        if (avaliacoes.length > 0) {
            const somaNotas = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
            const mediaNotas = somaNotas / avaliacoes.length;
            const estrelas = document.querySelector(`[data-id="${pratoId}"] .estrelas`);
            if (estrelas) {
                atualizarEstrelas(estrelas, mediaNotas);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

function criarModalAvaliacao(pratoId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Avaliar Prato</h3>
            <div class="estrelas-modal">★★★★★</div>
            <textarea placeholder="Deixe seu comentário (opcional)"></textarea>
            <div class="modal-buttons">
                <button class="btn-cancelar">Cancelar</button>
                <button class="btn-enviar">Enviar Avaliação</button>
            </div>
        </div>
    `;

    // Eventos do modal
    const btnCancelar = modal.querySelector('.btn-cancelar');
    const btnEnviar = modal.querySelector('.btn-enviar');
    const estrelas = modal.querySelector('.estrelas-modal');
    const textarea = modal.querySelector('textarea');

    btnCancelar.addEventListener('click', () => {
        modal.remove();
    });

    btnEnviar.addEventListener('click', async () => {
        const nota = parseInt(estrelas.dataset.nota || '0');
        const comentario = textarea.value;

        if (nota === 0) {
            alert('Por favor, selecione uma nota');
            return;
        }

        try {
            const res = await fetch('/api/avaliacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pratoId: parseInt(pratoId),
                    nota,
                    comentario,
                    nome: 'Anônimo' // Você pode adicionar um campo para o nome se desejar
                })
            });

            if (res.ok) {
                carregarAvaliacoes(pratoId);
                modal.remove();
            } else {
                alert('Erro ao enviar avaliação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        }
    });

    return modal;
}