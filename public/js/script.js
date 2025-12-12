document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-grid');

    // Função para buscar dados da API
    async function loadMenu() {
        try {
            const response = await fetch('/api/menu'); // Chama nosso backend
            const menuItems = await response.json();

            renderMenu(menuItems);
        } catch (error) {
            console.error('Erro ao buscar cardápio:', error);
            menuContainer.innerHTML = '<p class="message error">Erro ao carregar o cardápio. Tente novamente.</p>';
        }
    }

    // Função para criar o HTML de cada item
    function renderMenu(items) {
        menuContainer.innerHTML = ''; // Limpa o "Carregando..."

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="card-body">
                    <span class="card-price">R$ ${item.price.toFixed(2)}</span>
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-desc">${item.description}</p>
                    <button class="btn-order" onclick="addToCart(${item.id})">Adicionar ao Pedido</button>
                </div>
            `;
            menuContainer.appendChild(card);
        });
    }

    loadMenu();
});

function addToCart(id) {
    alert(`Produto ID ${id} adicionado! (Funcionalidade futura)`);
}