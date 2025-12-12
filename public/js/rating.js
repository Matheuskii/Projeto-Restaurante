document.addEventListener('DOMContentLoaded', () => {
    let pratoSelecionado = null;
    let avaliacaoAtual = 0;

    // Elementos da modal
    const modalOverlay = document.getElementById('modal-avaliacao');
    const ratingContainer = document.querySelector('.rating-stars'); // Elemento que estava dando erro

    // Se não houver estrelas na tela (ex: tela de login), para o script aqui.
    if (!ratingContainer) return;

    const modalClose = document.querySelector('.modal-close');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEnviar = document.getElementById('btn-enviar');
    const stars = document.querySelectorAll('.star');
    const descricaoTextarea = document.getElementById('descricao-avaliacao');

    // Fechar modal
    if(btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if(modalOverlay) modalOverlay.style.display = 'none';
        });
    }

    // Sistema de estrelas
    stars.forEach(star => {
        star.addEventListener('click', () => {
            avaliacaoAtual = parseInt(star.getAttribute('data-valor'));
            atualizarEstrelas();
        });

        star.addEventListener('mouseover', () => {
            const valor = parseInt(star.getAttribute('data-valor'));
            stars.forEach(s => {
                const sValor = parseInt(s.getAttribute('data-valor'));
                s.style.color = sValor <= valor ? '#ffd700' : '#444';
            });
        });
    });

    // Resetar efeito hover das estrelas
    ratingContainer.addEventListener('mouseleave', () => {
        atualizarEstrelas();
    });

    function atualizarEstrelas() {
        stars.forEach(star => {
            const valor = parseInt(star.getAttribute('data-valor'));
            star.style.color = valor <= avaliacaoAtual ? '#ffd700' : '#444';
        });
    }

    // Enviar avaliação
    if(btnEnviar) {
        btnEnviar.addEventListener('click', async () => {
            if (avaliacaoAtual === 0) {
                alert('Selecione as estrelas!');
                return;
            }
            // Aqui você pode adicionar a lógica de fetch para salvar
            alert('Avaliação enviada! Obrigado.');
            if(modalOverlay) modalOverlay.style.display = 'none';
        });
    }
});