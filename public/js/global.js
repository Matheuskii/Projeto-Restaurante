// === TOAST ===
if (!document.getElementById('toast-box')) {
    const box = document.createElement('div');
    box.id = 'toast-box';
    document.body.appendChild(box);
}
window.showToast = (msg, type = 'info') => {
    const div = document.createElement('div');
    div.className = 'toast';
    div.innerHTML = `<span>${msg}</span>`;
    if(type === 'success') div.style.borderColor = '#2ea043';
    if(type === 'error') div.style.borderColor = '#da3633';
    document.getElementById('toast-box').appendChild(div);
    setTimeout(() => div.remove(), 3000);
};

// === CARRINHO ===
window.addToCart = (nome, preco, img) => {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    cart.push({ nome, preco, img });
    localStorage.setItem('carrinho', JSON.stringify(cart));
    showToast(`${nome} adicionado!`, 'success');
};

// === HEADER & AUTH ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        const loginBtn = document.getElementById('nav-login-btn');
        const userArea = document.getElementById('nav-user-area');
        const userName = document.getElementById('user-name-display');

        if (data.logado) {
            if(loginBtn) loginBtn.style.display = 'none';
            if(userArea) userArea.style.display = 'block';
            if(userName) userName.textContent = data.user.nome.split(' ')[0];
        } else {
            if(loginBtn) loginBtn.style.display = 'block';
            if(userArea) userArea.style.display = 'none';
        }
    } catch (e) {}

    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-logout')) {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = 'index.html';
        }
    });
});