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

// Cadastro
document.getElementById('form-cadastro').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('mensagem').textContent = 'Cadastro realizado com sucesso!';
});

// Carrossel de sugestões
let indice = 0;
const itens = document.querySelectorAll('.carrossel .item');

function mudarSugestao() {
  itens[indice].classList.remove('ativo');
  indice = (indice + 1) % itens.length;
  itens[indice].classList.add('ativo');
}
setInterval(mudarSugestao, 3000); // troca a cada 3 segundos
