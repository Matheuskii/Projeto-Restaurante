// Menu hambúrguer
const hamburger = document.getElementById('hamburger');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Pesquisa de pratos
function filtrarPratos() {
  const input = document.getElementById('pesquisa').value.toLowerCase();
  const pratos = document.querySelectorAll('.prato');

  pratos.forEach(prato => {
    const texto = prato.textContent.toLowerCase();
    prato.style.display = texto.includes(input) ? 'block' : 'none';
  });
}

// Login (simulado)
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      // Detecta se estamos rodando via Live Server (porta 5500/5501) ou direto do sistema de arquivos
      // nesses casos o endpoint relativo '/' aponta para o Live Server sem rota /api/login, então
      // usamos o servidor Express em http://localhost:3000 como fallback.
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
      if (res.ok) {
        document.getElementById('mensagem').textContent = data.message;
        document.getElementById('mensagem').style.color = '#bfa46a';
      } else {
        document.getElementById('mensagem').textContent = data.error || 'Falha no login';
        document.getElementById('mensagem').style.color = '#e06a6a';
      }
    } catch (err) {
      document.getElementById('mensagem').textContent = 'Erro de conexão com o servidor';
      document.getElementById('mensagem').style.color = '#e06a6a';
    }
  });
}

// Carrossel de sugestões
let indice = 0;
const itens = document.querySelectorAll('.carrossel .item');

function mudarSugestao() {
  itens[indice].classList.remove('ativo');
  indice = (indice + 1) % itens.length;
  itens[indice].classList.add('ativo');
}
setInterval(mudarSugestao, 3000); // troca a cada 3 segundos
