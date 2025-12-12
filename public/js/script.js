document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-grid');

    async function loadMenu() {
        try {
            const response = await fetch('/api/menu');
            if (!response.ok) throw new Error('Erro na API');
            const menuItems = await response.json();
            renderMenu(menuItems || []);
        } catch (error) {
            console.error(error);
            if(menuContainer) menuContainer.innerHTML = '<p style="text-align:center">Erro ao carregar cardápio.</p>';
        }
    }

    function renderMenu(items) {
        if(!menuContainer) return;
        menuContainer.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card-produto');
            
            const preco = item.preco || item.price || 0;
            const img = item.imagem || item.image || 'https://via.placeholder.com/300';
            const nome = item.nome || item.name || 'Prato';
            const descricao = item.descricao || '';

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${img}" alt="${nome}">
                </div>
                <div class="card-body">
                    <div class="card-header">
                        <h3 class="card-title">${nome}</h3>
                        <span class="card-price">R$ ${Number(preco).toFixed(2)}</span>
                    </div>
                    <p class="card-desc visible">${descricao}</p>
                    
                    <div class="card-actions">
                        <button class="btn-avaliar" onclick="verificarAuthEExecutar(() => abrirModalAvaliacao('${item.id}', '${nome}'))">
                            <i class="fas fa-star"></i> Avaliar
                        </button>
                        
                        <button class="btn-pedir" onclick="verificarAuthEExecutar(() => adicionarAoCarrinho('${nome}', ${preco}, '${img}'))">
                            Pedir
                        </button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(card);
        });
    }

    loadMenu();
});

// === FUNÇÕES GLOBAIS ===

// 1. Adicionar ao Carrinho (LocalStorage)
window.adicionarAoCarrinho = function(name, price, img) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ name, price, img });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Notificação elegante
    showToast(`${name} adicionado ao carrinho!`, 'success');
}

// 2. Verificar Login
window.verificarAuthEExecutar = async function(acaoCallback) {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();

        if (data.logado) {
            acaoCallback();
        } else {
            show('Faça login para continuar!');
            window.location.href = 'login.html';
        }
    } catch (error) {
        window.location.href = 'login.html';
    }
}

// 3. Abrir Modal (Correção do erro "não encontrado")
window.abrirModalAvaliacao = function(id, nome) {
    const modal = document.getElementById('modal-avaliacao');
    if(modal) {
        modal.style.display = 'flex';
        const titulo = modal.querySelector('.prato-nome');
        if(titulo) titulo.textContent = `Avaliar: ${nome}`;
        
        // Reset
        document.querySelectorAll('.star').forEach(s => s.style.color = '#ccc');
        document.getElementById('descricao-avaliacao').value = '';
        
        // Fechar
        document.getElementById('btn-cancelar').onclick = () => modal.style.display = 'none';
    } else {
        showToast("Erro: Modal não encontrado no HTML");
    }
}