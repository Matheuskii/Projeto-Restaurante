try {
    const response = await fetch('/api/cadastro', { // Chama a API real
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (response.ok) {
        mensagem.style.color = '#4CAF50';
        mensagem.textContent = 'Cadastro realizado! Redirecionando...';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } else {
        mensagem.style.color = '#ff4444';
        showToast(data.error || 'Erro no servidor.', 'error');
    }
} catch (error) {
    console.error(error);
    mensagem.style.color = '#ff4444';
    mensagem.textContent = 'Erro no servidor.';
}