document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const mensagem = document.getElementById('mensagem');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const lembrar = document.getElementById('lembrar')?.checked;
            
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso no login
                    mensagem.style.color = '#4CAF50';
                    mensagem.textContent = data.message;

                    // Redireciona após um breve delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    // Erro no login
                    mensagem.style.color = '#ff4444';
                    mensagem.textContent = data.error || 'Erro ao fazer login';
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
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

    // Verifica se já está logado e redireciona se estiver
    async function checkLoginStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/check-auth', {
                credentials: 'include'
            });
            
            if (response.ok) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Erro ao verificar status de login:', error);
        }
    }

    // Verifica o status de login ao carregar a página
    checkLoginStatus();
});