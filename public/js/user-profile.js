document.addEventListener('DOMContentLoaded', () => {
    const userMenuArea = document.getElementById('user-menu-area');
    const loginBtnArea = document.getElementById('login-btn-area');
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutButtons = document.querySelectorAll('.btn-logout');

    // Verifica login ao carregar
    checkAuth();

    async function checkAuth() {
        try {
            const response = await fetch('/api/check-auth');
            const data = await response.json();

            if (data.logado && data.user) {
                // ESTÁ LOGADO: Mostra ícone, esconde botão login
                if(userMenuArea) userMenuArea.style.display = 'block';
                if(loginBtnArea) loginBtnArea.style.display = 'none';
                
                // Atualiza nome
                if(userNameDisplay) userNameDisplay.textContent = data.user.nome;
            } else {
                // NÃO LOGADO: Esconde ícone, mostra botão login
                if(userMenuArea) userMenuArea.style.display = 'none';
                if(loginBtnArea) loginBtnArea.style.display = 'block';
            }
        } catch (error) {
            console.error("Erro auth:", error);
            // Fallback em caso de erro
            if(userMenuArea) userMenuArea.style.display = 'none';
            if(loginBtnArea) loginBtnArea.style.display = 'block';
        }
    }

    // Configura botões de logout
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = 'index.html';
        });
    });
});