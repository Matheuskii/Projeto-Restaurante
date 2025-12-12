document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Configurar Data Mínima (Hoje)
    const inputData = document.getElementById('data');
    if(inputData) {
        const hoje = new Date().toISOString().split('T')[0];
        inputData.min = hoje;
        inputData.value = hoje; // Já deixa marcado hoje
    }

    // 2. Tentar preencher dados do usuário automaticamente
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (data.logado) {
            // Preenche nome se o campo estiver vazio
            const nomeInput = document.getElementById('nome');
            if(nomeInput && !nomeInput.value) nomeInput.value = data.user.nome;
            
            // Define o email no campo hidden ou visivel
            const emailInput = document.getElementById('email');
            if(emailInput) emailInput.value = data.user.email;
        } else {
            // Se não logado, expulsa
            window.location.href = 'login.html';
        }
    } catch (e) { console.error(e); }

    // 3. Enviar Formulário
    const form = document.getElementById('form-reserva');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value || 'cliente@sistema.com',
                telefone: document.getElementById('telefone').value,
                data: document.getElementById('data').value,
                horario: document.getElementById('horario').value, // Agora pega do Select
                pessoas: document.getElementById('pessoas').value,
                preferencia: document.getElementById('preferencia').value,
                observacoes: document.getElementById('observacoes').value
            };

            try {
                const res = await fetch('/api/reservas', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(dados)
                });
                
           if (response.ok) {
    showToast('Reserva agendada com sucesso!', 'success'); 
    setTimeout(() => {
        window.location.href = 'minhas-reservas.html';
    }, 2000); 
} else {
    showToast('Erro ao realizar reserva.', 'error');
}
            } catch(err) {
                showToast('Erro de conexão.', 'error');
            }
        });
    }
});