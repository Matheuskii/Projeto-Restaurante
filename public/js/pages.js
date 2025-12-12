document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // === HOME: CARROSSEL ===
    // Verifica se está na home
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        const track = document.querySelector('.carousel-track');
        if (track) {
            const items = document.querySelectorAll('.carousel-item');
            let idx = 0;
            const total = items.length;

            const moveCarousel = () => {
                idx = (idx + 1) % total;
                track.style.transform = `translateX(-${idx * 100}%)`;
            };

            // Auto Play
            const interval = setInterval(moveCarousel, 4000);

            // Botões
            const nextBtn = document.querySelector('.next');
            const prevBtn = document.querySelector('.prev');

            if(nextBtn) nextBtn.addEventListener('click', () => {
                moveCarousel();
                clearInterval(interval); // Pausa se clicar
            });

            if(prevBtn) prevBtn.addEventListener('click', () => {
                idx = (idx - 1 + total) % total;
                track.style.transform = `translateX(-${idx * 100}%)`;
                clearInterval(interval);
            });
        }
    }
    // === TELA: LOGIN ===
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // <--- ISSO IMPEDE A PÁGINA DE RESETAR

            const btn = formLogin.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Entrando...';
            btn.disabled = true;

            const formData = {};
            new FormData(formLogin).forEach((v, k) => formData[k] = v);

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                const data = await res.json();

                if (res.ok) {
                    showToast('Login realizado!', 'success');
                    setTimeout(() => window.location.href = 'index.html', 1000);
                } else {
                    showToast(data.error || 'E-mail ou senha errados', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                showToast('Erro de conexão com o servidor', 'error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // === TELA: CADASTRO ===
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault(); // <--- ISSO IMPEDE O RESET

            const formData = {};
            new FormData(formCadastro).forEach((v, k) => formData[k] = v);

            // Validação simples de senha
            if(formData.senha !== formData.confsenha) {
                showToast('As senhas não coincidem!', 'error');
                return;
            }

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });
                const data = await res.json();

                if (res.ok) {
                    showToast('Conta criada! Faça login.', 'success');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    showToast(data.error || 'Erro ao cadastrar', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão', 'error');
            }
        });
    }

    // === TELA: CARDÁPIO ===
    if (path.includes('cardapio.html')) {
        const grid = document.getElementById('menu-grid');
        if (grid) {
            fetch('/api/menu').then(r => r.json()).then(items => {
                grid.innerHTML = items.map(i => `
                    <div class="card-produto">
                        <div class="card-img-wrapper"><img src="${i.imagem}" alt="${i.nome}"></div>
                        <div class="card-body">
                            <div class="card-header"><h3>${i.nome}</h3><span class="card-price">R$ ${i.preco.toFixed(2)}</span></div>
                            <p class="card-desc">${i.descricao}</p>
                            <div class="card-actions">
                                <button class="btn-avaliar" onclick="alert('Em breve!')"><i class="fas fa-star"></i></button>
                                <button class="btn-pedir" onclick="addToCart('${i.nome}', ${i.preco}, '${i.imagem}')">PEDIR</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
        }
    }

    // === TELA: RESERVAS ===
    const formReserva = document.getElementById('form-reserva');
    if (formReserva) {
        document.getElementById('data').min = new Date().toISOString().split('T')[0];

        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();
            const auth = await fetch('/api/auth/status').then(r => r.json());

            if(!auth.logado) {
                showToast('Faça login para reservar!', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            const formData = {};
            new FormData(formReserva).forEach((v, k) => formData[k] = v);

            const res = await fetch('/api/reservas', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast('Reserva confirmada!', 'success');
                setTimeout(() => window.location.href = 'minhas-reservas.html', 1500);
            }
        });
    }

    // === TELA: MINHAS RESERVAS ===
    const listaReservas = document.getElementById('reservas-list');
    if (listaReservas) {
        fetch('/api/minhas-reservas')
            .then(res => res.json())
            .then(data => {
                if (data.error) { window.location.href = 'login.html'; return; }
                if (data.length === 0) { listaReservas.innerHTML = '<p style="text-align:center; color:#888">Você não tem reservas.</p>'; return; }

                listaReservas.innerHTML = data.map(r => `
                    <div class="ticket">
                        <div class="ticket-left">
                            <span class="day">${r.data.split('-')[2]}</span>
                            <span class="month">AGENDA</span>
                        </div>
                        <div class="ticket-right">
                            <span class="status ${r.status}">${r.status}</span>
                            <h3>Mesa para ${r.pessoas} Pessoas</h3>
                            <div class="ticket-detail">
                                <span><i class="fas fa-clock"></i> ${r.horario}</span>
                                <span><i class="fas fa-couch"></i> ${r.preferencia}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
    }

    // === TELA: CARRINHO ===
    if (path.includes('carrinho.html')) {
        renderCarrinho();
    }
});

// Funções Auxiliares do Carrinho
function renderCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    // Pegando os elementos pelos novos IDs
    const subEl = document.getElementById('sub-valor');
    const taxaEl = document.getElementById('taxa-valor');
    const totalEl = document.getElementById('total-valor');

    if (!lista) return;

    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Se vazio
    if (cart.length === 0) {
        lista.innerHTML = '<p style="text-align:center; padding:20px; color:#888">Seu carrinho está vazio.</p>';
        if(subEl) subEl.innerText = 'R$ 0.00';
        if(taxaEl) taxaEl.innerText = 'R$ 0.00';
        if(totalEl) totalEl.innerText = 'R$ 0.00';
        return;
    }

    // Calcula Totais
    let subtotal = 0;

    // Renderiza Lista
    lista.innerHTML = cart.map((item, index) => {
        subtotal += Number(item.preco); // Garante que é número
        return `
            <div class="cart-item">
                <div style="display:flex; align-items:center">
                    <img src="${item.img}" alt="${item.nome}" onerror="this.src='https://via.placeholder.com/100'">
                    <div class="cart-info">
                        <h3>${item.nome}</h3>
                        <span>R$ ${Number(item.preco).toFixed(2)}</span>
                    </div>
                </div>
                <button class="btn-remove" onclick="removeCartItem(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    // Matemática (10% de taxa)
    const taxa = subtotal * 0.10;
    const total = subtotal + taxa;

    // Atualiza na tela
    if(subEl) subEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    if(taxaEl) taxaEl.innerText = `R$ ${taxa.toFixed(2)}`;
    if(totalEl) totalEl.innerText = `R$ ${total.toFixed(2)}`;
}

window.removeCartItem = (index) => {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    cart.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(cart));
    renderCarrinho();
    showToast('Item removido.', 'error');
};

window.finalizarPedido = () => {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    if(cart.length === 0) return showToast('Carrinho vazio!', 'error');
    localStorage.removeItem('carrinho');
    renderCarrinho();
    showToast('Pedido enviado para a cozinha!', 'success');
};