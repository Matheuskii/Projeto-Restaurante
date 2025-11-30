document.addEventListener('DOMContentLoaded', () => {
    let pratoSelecionado = null;
    let avaliacaoAtual = 0;

    // Elementos da modal
    const modalOverlay = document.getElementById('modal-avaliacao');
    const modalClose = document.querySelector('.modal-close');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnEnviar = document.getElementById('btn-enviar');
    const stars = document.querySelectorAll('.star');
    const descricaoTextarea = document.getElementById('descricao-avaliacao');
    const pratoNomeElement = document.querySelector('.prato-nome');

    // Abrir modal ao clicar em "Avaliar"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-avaliar')) {
            e.preventDefault();
            
            // Verificar se usuário está logado
            fetch('http://localhost:3000/api/check-auth', {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.logado) {
                        // Redirecionar para login
                        window.location.href = '/login.html';
                        return;
                    }
                    
                    // Abrir modal
                    pratoSelecionado = e.target.getAttribute('data-prato-id');
                    const card = e.target.closest('.card-produto');
                    const pratoNome = card.querySelector('.produto-nome').textContent;
                    
                    pratoNomeElement.textContent = pratoNome;
                    resetarModal();
                    modalOverlay.classList.add('active');
                })
                .catch(err => {
                    console.error('Erro ao verificar autenticação:', err);
                    window.location.href = '/login.html';
                });
        }
    });

    // Fechar modal
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    btnCancelar.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Fechar modal ao clicar fora
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Sistema de estrelas
    stars.forEach(star => {
        star.addEventListener('click', () => {
            avaliacaoAtual = parseInt(star.getAttribute('data-valor'));
            atualizarEstrelas();
            btnEnviar.disabled = false;
        });

        star.addEventListener('mouseover', () => {
            const valor = parseInt(star.getAttribute('data-valor'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-valor')) <= valor) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#444';
                }
            });
        });
    });

    // Atualizar aparência das estrelas
    function atualizarEstrelas() {
        stars.forEach(star => {
            const valor = parseInt(star.getAttribute('data-valor'));
            if (valor <= avaliacaoAtual) {
                star.classList.add('active');
                star.style.color = '#ffd700';
            } else {
                star.classList.remove('active');
                star.style.color = '#444';
            }
        });
    }

    // Resetar efeito hover das estrelas
    document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
        if (avaliacaoAtual === 0) {
            stars.forEach(s => s.style.color = '#444');
        } else {
            atualizarEstrelas();
        }
    });

    // Habilitar botão ao digitar descrição (mas exigir estrelas selecionadas)
    descricaoTextarea.addEventListener('input', () => {
        if (avaliacaoAtual > 0) {
            btnEnviar.disabled = false;
        }
    });

    // Enviar avaliação
    btnEnviar.addEventListener('click', async () => {
        if (avaliacaoAtual === 0) {
            alert('Por favor, selecione uma quantidade de estrelas!');
            return;
        }

        const descricao = descricaoTextarea.value.trim();

        try {
            const response = await fetch(`http://localhost:3000/api/avaliacoes/${pratoSelecionado}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    nota: avaliacaoAtual,
                    descricao: descricao
                })
            });

            if (response.ok) {
                alert('Avaliação enviada com sucesso! Obrigado!');
                modalOverlay.classList.remove('active');
                resetarModal();
            } else {
                const error = await response.json();
                alert('Erro ao enviar avaliação: ' + error.mensagem);
            }
        } catch (err) {
            console.error('Erro ao enviar avaliação:', err);
            alert('Erro ao conectar com o servidor!');
        }
    });

    // Resetar estado da modal
    function resetarModal() {
        avaliacaoAtual = 0;
        pratoSelecionado = null;
        descricaoTextarea.value = '';
        btnEnviar.disabled = true;
        stars.forEach(s => {
            s.classList.remove('active');
            s.style.color = '#444';
        });
    }
});
