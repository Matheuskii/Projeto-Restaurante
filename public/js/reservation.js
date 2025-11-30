// Gerenciamento de Reservas
document.addEventListener('DOMContentLoaded', () => {
    const formReserva = document.getElementById('form-reserva');
    const inputData = document.getElementById('data');
    const mensagemDiv = document.getElementById('mensagem-reserva');
    
    if (formReserva) {
        // Definir datas mínima e máxima
        const hoje = new Date();
        const diaMaximo = new Date(hoje.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano a partir de hoje

        // Formatar data para o formato YYYY-MM-DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Definir valores mínimo e máximo
        if (inputData) {
            inputData.min = formatDate(hoje);
            inputData.max = formatDate(diaMaximo);
        }

        // Validar ao enviar o formulário
        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const data = document.getElementById('data').value;
            const horario = document.getElementById('horario').value;
            const pessoas = document.getElementById('pessoas').value;
            const preferencia = document.getElementById('preferencia').value;
            const observacoes = document.getElementById('observacoes').value.trim();

            // Validação básica
            if (!nome || !email || !data || !horario || !pessoas) {
                exibirMensagem('Por favor, preencha todos os campos obrigatórios', 'erro');
                return;
            }

            // Validar data
            const dataSelecionada = new Date(data);
            const dataHoje = new Date();
            dataHoje.setHours(0, 0, 0, 0);

            if (dataSelecionada < dataHoje) {
                exibirMensagem('Não é possível reservar no passado', 'erro');
                return;
            }

            const dataMaxima = new Date(dataHoje.getTime() + 365 * 24 * 60 * 60 * 1000);
            if (dataSelecionada > dataMaxima) {
                exibirMensagem('Reservas podem ser feitas com até 1 ano de antecedência', 'erro');
                return;
            }

            // Enviar reserva
            await enviarReserva({
                nome,
                email,
                telefone,
                data,
                horario,
                pessoas,
                preferencia,
                observacoes
            });
        });
    }

    async function enviarReserva(dados) {
        try {
            const response = await fetch('http://localhost:3000/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                exibirMensagem('✓ Reserva realizada com sucesso! Redirecionando...', 'sucesso');
                formReserva.reset();

                setTimeout(() => {
                    window.location.href = 'minhas-reservas.html';
                }, 2000);
            } else {
                exibirMensagem(result.error || 'Erro ao fazer a reserva', 'erro');
            }
        } catch (error) {
            console.error('Erro:', error);
            exibirMensagem('Erro ao conectar com o servidor', 'erro');
        }
    }

    function exibirMensagem(texto, tipo) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem-reserva ${tipo}`;
        
        // Auto-limpar erro após 5 segundos
        if (tipo === 'erro') {
            setTimeout(() => {
                mensagemDiv.textContent = '';
                mensagemDiv.className = 'mensagem-reserva';
            }, 5000);
        }
    }
});