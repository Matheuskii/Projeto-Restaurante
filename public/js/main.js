// Menu hambúrguer (defensivo)
const hamburger = document.getElementById('hamburger');
const navbar = document.querySelector('.navbar');
if (hamburger && navbar) {
  hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });
}

// Pesquisa de pratos
function filtrarPratos() {
  const inputEl = document.getElementById('pesquisa');
  if (!inputEl) return;
  const input = inputEl.value.toLowerCase();
  const pratos = document.querySelectorAll('.prato');

  pratos.forEach(prato => {
    const texto = prato.textContent.toLowerCase();
    prato.style.display = texto.includes(input) ? 'block' : 'none';
  });
}

// Login (via API)
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
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
        setTimeout(() => { location.href = 'cardapio.html'; }, 700);
      } else {
        if (msgEl) {
          msgEl.textContent = data.error || 'Falha no login';
          msgEl.style.color = '#e06a6a';
        }
      }
    } catch (err) {
      const msgEl = document.getElementById('mensagem');
      if (msgEl) {
        msgEl.textContent = 'Erro de conexão com o servidor';
        msgEl.style.color = '#e06a6a';
      }
    }
  });
}

// Carrossel de sugestões
let indice = 0;
const itens = document.querySelectorAll('.carrossel .item');
if (itens && itens.length) {
  function mudarSugestao() {
    itens[indice].classList.remove('ativo');
    indice = (indice + 1) % itens.length;
    itens[indice].classList.add('ativo');
  }
  setInterval(mudarSugestao, 3000); // troca a cada 3 segundos
}
