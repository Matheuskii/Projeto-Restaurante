// Animações e interatividade
document.addEventListener('DOMContentLoaded', () => {
    // Header animado ao rolar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');
    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const isExpanded = navbar.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Carrossel automático
    const carrossel = document.querySelector('.carrossel');
    if (carrossel) {
        const items = carrossel.querySelectorAll('.item');
        let currentItem = 0;

        function nextItem() {
            items[currentItem].classList.remove('ativo');
            currentItem = (currentItem + 1) % items.length;
            items[currentItem].classList.add('ativo');
        }

        setInterval(nextItem, 3000);
    }

    // Animação de loading no login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('btn-loading');
            
            try {
                // Seu código de login existente aqui
                const email = document.getElementById('email').value;
                const senha = document.getElementById('senha').value;

                const isLocalFile = location.protocol === 'file:';
                const liveServerPorts = ['5500', '5501'];
                const isLiveServer = liveServerPorts.includes(location.port);
                const API_BASE = (isLocalFile || isLiveServer) ? 'http://localhost:3000' : '';

                const res = await fetch(`${API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const data = await res.json();
                const msgEl = document.getElementById('mensagem');
                
                if (res.ok) {
                    if (msgEl) {
                        msgEl.textContent = data.message;
                        msgEl.style.color = '#bfa46a';
                    }
                    if (data.user) sessionStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    if (msgEl) {
                        msgEl.textContent = data.message || 'Erro ao fazer login';
                        msgEl.style.color = '#ff4444';
                    }
                }
            } catch (error) {
                console.error('Erro:', error);
                const msgEl = document.getElementById('mensagem');
                if (msgEl) {
                    msgEl.textContent = 'Erro ao conectar com o servidor';
                    msgEl.style.color = '#ff4444';
                }
            } finally {
                submitBtn.classList.remove('btn-loading');
            }
        });
    }

    // Feedback visual para pesquisa de pratos
    const pesquisaInput = document.getElementById('pesquisa');
    if (pesquisaInput) {
        pesquisaInput.addEventListener('input', () => {
            const pratos = document.querySelectorAll('.prato');
            const termo = pesquisaInput.value.toLowerCase();
            
            pratos.forEach(prato => {
                const texto = prato.textContent.toLowerCase();
                const match = texto.includes(termo);
                prato.style.opacity = match ? '1' : '0.3';
                prato.style.transform = match ? 'translateY(-5px)' : 'none';
            });
        });
    }
});