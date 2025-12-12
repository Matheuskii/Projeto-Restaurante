document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
});

// Tornar a função global para o HTML acessar
window.finalizarPedido = function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        showToast("Seu carrinho está vazio!", 'error'); // Troquei alert por showToast
        return;
    }

    showToast("Pedido enviado para a cozinha! Aguarde.", 'success'); // Troquei alert por showToast
    
    localStorage.removeItem('carrinho');
    carregarCarrinho();
}

function carregarCarrinho() {
    const lista = document.getElementById('lista-itens');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

   if (carrinho.length === 0) {
    lista.innerHTML = `
        <div style="text-align:center; padding: 50px 20px; opacity: 0.6;">
            <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--gold); margin-bottom: 20px;"></i>
            <h3 style="color: #fff; margin-bottom: 10px;">Seu carrinho está vazio</h3>
            <p style="color: var(--text-muted);">Parece que você ainda não escolheu nenhum prato delicioso.</p>
            <a href="cardapio.html" class="btn-primary" style="display:inline-block; margin-top:20px; width:auto;">Ir para o Cardápio</a>
        </div>
    `;
    atualizarValores(0);
    return;
}
    lista.innerHTML = '';
    let subtotal = 0;

    carrinho.forEach((item, index) => {
        subtotal += parseFloat(item.price);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div style="display:flex; align-items:center;">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${parseFloat(item.price).toFixed(2)}</div>
                </div>
            </div>
            <button class="btn-remove" onclick="removerItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        lista.appendChild(itemDiv);
    });

    atualizarValores(subtotal);
}

function atualizarValores(subtotal) {
    const taxa = subtotal * 0.10;
    const total = subtotal + taxa;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('taxa').textContent = `R$ ${taxa.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

window.removerItem = function(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}