document.addEventListener('DOMContentLoaded', () => {
  // Menu hambúrguer
  const hamburger = document.getElementById('hamburger');
  const navbar = document.querySelector('.navbar');
  
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navbar.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navbar.classList.contains('active'));
    });

    // Fechar menu ao clicar em um link
    const navLinks = navbar.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Pesquisa de pratos
  window.filtrarPratos = function() {
    const inputEl = document.getElementById('pesquisa');
    if (!inputEl) return;
    const input = inputEl.value.toLowerCase();
    const pratos = document.querySelectorAll('.prato');

    pratos.forEach(prato => {
      const texto = prato.textContent.toLowerCase();
      prato.style.display = texto.includes(input) ? 'block' : 'none';
    });
  };

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
});
