document.addEventListener('DOMContentLoaded', () => {
    const userMenu = document.querySelector('.user-menu');
    const loginButton = document.querySelector('.btn-login');
    const userSidebar = document.querySelector('.user-sidebar');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    const logoutBtns = document.querySelectorAll('.btn-logout');

    // Verifica se o usuário está logado ao carregar a página
    async function checkLoginStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/check-auth', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                userMenu.style.display = 'inline-block';
                loginButton.style.display = 'none';
                updateUserInfo(data.user);
            } else {
                userMenu.style.display = 'none';
                loginButton.style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Erro ao verificar status de login:', error);
            userMenu.style.display = 'none';
            loginButton.style.display = 'inline-block';
        }
    }

    // Atualiza as informações do usuário no menu
    function updateUserInfo(user) {
        const userNameElements = document.querySelectorAll('.user-name');
        const userEmailElement = document.querySelector('.profile-email');
        
        userNameElements.forEach(element => {
            element.textContent = user.nome;
        });
        
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    }

    // Abre a sidebar
    document.querySelector('.user-avatar')?.addEventListener('click', (e) => {
        e.preventDefault();
        userSidebar.classList.add('active');
    });

    // Fecha a sidebar
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            userSidebar.classList.remove('active');
        });
    }

    // Fecha a sidebar quando clicar fora dela
    document.addEventListener('click', (e) => {
        if (!userSidebar.contains(e.target) && 
            !e.target.closest('.user-avatar')) {
            userSidebar.classList.remove('active');
        }
    });

    // Função de logout
    async function handleLogout() {
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                userSidebar.classList.remove('active');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    // Adiciona evento de logout em todos os botões de logout
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Verifica o status de login ao carregar a página
    checkLoginStatus();
});