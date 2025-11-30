document.addEventListener('DOMContentLoaded', () => {
    // Função para filtrar pratos
    window.filtrarPratos = () => {
        const input = document.getElementById('pesquisa').value.toLowerCase();
        const cardsProdutos = document.querySelectorAll('.card-produto');

        cardsProdutos.forEach(card => {
            const nome = card.querySelector('.produto-nome').textContent.toLowerCase();
            const descricao = card.querySelector('.produto-descricao').textContent.toLowerCase();
            
            if (nome.includes(input) || descricao.includes(input)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Adicionar evento de clique para os botões de descrição
    const botoesDescricao = document.querySelectorAll('.btn-descricao');
    botoesDescricao.forEach(botao => {
        botao.addEventListener('click', () => {
            // Encontra a descrição dentro do mesmo .produto-info
            const produtoInfo = botao.closest('.produto-info');
            const descricao = produtoInfo.querySelector('.produto-descricao');
            const estaVisivel = descricao.classList.contains('visible');
            
            // Fecha todas as descrições abertas
            document.querySelectorAll('.produto-descricao').forEach(desc => {
                desc.classList.remove('visible');
            });
            document.querySelectorAll('.btn-descricao').forEach(btn => {
                btn.textContent = 'Ver Descrição';
            });

            // Se a descrição não estava visível, abre ela
            if (!estaVisivel) {
                descricao.classList.add('visible');
                botao.textContent = 'Ocultar Descrição';
            }
        });
    });
});