document.addEventListener('DOMContentLoaded', () => {
    // ===== LOGIN =====
    const formLogin = document.getElementById('form-login');
    const mensagem = document.getElementById('mensagem');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    mensagem.style.color = '#4CAF50';
showToast('Login realizado com sucesso!', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    mensagem.style.color = '#ff4444';
showToast('E-mail ou senha incorretos.', 'error');                }
            } catch (error) {
                console.error('Erro:', error);
                mensagem.style.color = '#ff4444';
                mensagem.textContent = 'Erro ao conectar com o servidor';
            }
        });

        // Toggle de visibilidade da senha
        const togglePassword = document.querySelector('.toggle-password');
        const senhaInput = document.getElementById('senha');

        if (togglePassword && senhaInput) {
            togglePassword.addEventListener('click', () => {
                const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
                senhaInput.setAttribute('type', type);
                togglePassword.querySelector('i').classList.toggle('fa-eye');
                togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    }

    // ===== CHECK AUTH E MOSTRAR ÍCONE DE LOGIN =====
    async function checkLoginStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/check-auth', {
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.logado && data.user) {
                updateUserMenu(data.user);
                
                // Se estiver na página de login e já logado, redirecionar
                if (formLogin) {
                    window.location.href = 'index.html';
                }
            } else {
                hideUserMenu();
            }
        } catch (error) {
            console.error('Erro ao verificar login:', error);
            hideUserMenu();
        }
    }

    function updateUserMenu(user) {
        const userMenu = document.querySelector('.user-menu');
        const btnLogin = document.querySelector('.btn-login');
        const userName = document.querySelector('.user-name');
        const profileName = document.querySelector('.profile-name');
        const profileEmail = document.querySelector('.profile-email');
        
        if (userMenu) userMenu.style.display = 'flex';
        if (btnLogin) btnLogin.style.display = 'none';
        if (userName) userName.textContent = user.nome;
        if (profileName) profileName.textContent = user.nome;
        if (profileEmail) profileEmail.textContent = user.email;

        setupLogout();
    }

    function hideUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        const btnLogin = document.querySelector('.btn-login');
        
        if (userMenu) userMenu.style.display = 'none';
        if (btnLogin) btnLogin.style.display = 'inline-block';
    }

    function setupLogout() {
        const btnLogout = document.querySelector('.btn-logout');
        
        if (btnLogout) {
            btnLogout.addEventListener('click', async () => {
                try {
                    await fetch('http://localhost:3000/api/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });

                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                }
            });
        }
    }

    checkLoginStatus();
});