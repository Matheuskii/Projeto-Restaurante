document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-grid');

    // 1. CARREGAR CARDÁPIO
    async function loadMenu() {
        if (!menuContainer) return; // Se não estiver na tela de cardápio, sai.

        try {
            // Skeleton Loading (Efeito Visual)
            menuContainer.innerHTML = '<p style="text-align:center; color:#888;">Carregando delícias...</p>';

            const response = await fetch('/api/menu');
            const menuItems = await response.json();

            if(!Array.isArray(menuItems)) throw new Error("Formato inválido");

            renderMenu(menuItems);
        } catch (error) {
            console.error(error);
            menuContainer.innerHTML = '<p style="text-align:center">Erro ao carregar cardápio.</p>';
        }
    }

    function renderMenu(items) {
        menuContainer.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card-produto');
            const preco = item.preco || item.price || 0;
            const img = item.imagem || item.image || 'https://via.placeholder.com/300';
            const nome = item.nome || item.name || 'Prato';
            const desc = item.descricao || '';

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${img}" alt="${nome}" onerror="this.src='https://via.placeholder.com/300'">
                </div>
                <div class="card-body">
                    <div class="card-header">
                        <h3 class="card-title">${nome}</h3>
                        <span class="card-price">R$ ${Number(preco).toFixed(2)}</span>
                    </div>
                    <p class="card-desc visible">${desc}</p>
                    <div class="card-actions">
                        <button class="btn-avaliar" onclick="globalOpenModal('${item.id}', '${nome}')">
                            <i class="fas fa-star"></i> Avaliar
                        </button>
                        <button class="btn-pedir" onclick="globalAddToCart('${nome}', ${preco}, '${img}')">
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

// --- FUNÇÕES GLOBAIS (Para o onclick funcionar) ---

// 1. Adicionar ao Carrinho
window.globalAddToCart = async function(name, price, img) {
    // Verifica login
    const isLogged = await checkAuthGlobal();
    if (!isLogged) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ name, price, img });
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    showToast(`${name} adicionado!`, 'success');
}

// 2. Abrir Modal de Avaliação
window.globalOpenModal = async function(id, nome) {
    // Verifica login
    const isLogged = await checkAuthGlobal();
    if (!isLogged) return;

    const modal = document.getElementById('modal-avaliacao');
    if (modal) {
        modal.style.display = 'flex';
        const titulo = modal.querySelector('.prato-nome');
        if (titulo) titulo.textContent = `Avaliar: ${nome}`;

        // Reset e Setup do Botão Cancelar
        document.getElementById('btn-cancelar').onclick = () => modal.style.display = 'none';

        // Setup do Botão Enviar (Simples alerta por enquanto)
        const btnEnviar = document.getElementById('btn-enviar');
        btnEnviar.onclick = () => {
            showToast('Avaliação enviada!', 'success');
            modal.style.display = 'none';
        }
    } else {
        console.error("Modal não encontrado no HTML");
    }
}

// 3. Checagem de Auth Auxiliar
async function checkAuthGlobal() {
    try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (data.logado) return true;

        showToast('Faça login para continuar', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return false;
    } catch (e) {
        return false;
    }
}