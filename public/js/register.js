// Script de cadastro simplificado
document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');
    const mensagem = document.getElementById('mensagem');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            // Validação simples
            if (!nome || !email || !senha || !confirmarSenha) {
                mensagem.style.color = '#ff4444';
                mensagem.textContent = 'Por favor, preencha todos os campos';
                return;
            }

            if (senha !== confirmarSenha) {
                mensagem.style.color = '#ff4444';
                mensagem.textContent = 'As senhas não coincidem';
                return;
            }

            try {
                // Simular cadastro (em um TCC real, aqui você conectaria com seu backend)
                const userData = { nome, email };
                localStorage.setItem('user', JSON.stringify(userData));

                mensagem.style.color = '#4CAF50';
                mensagem.textContent = 'Cadastro realizado com sucesso!';

                // Redirecionar após 1 segundo
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                mensagem.style.color = '#ff4444';
                mensagem.textContent = 'Erro ao realizar cadastro';
            }
        });
    }
});