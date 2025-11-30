document.addEventListener('DOMContentLoaded', async () => {
    const reservasList = document.getElementById('reservas-list');

    // Carregar reservas da API
    async function carregarReservas() {
        try {
            const response = await fetch('http://localhost:3000/api/reservas', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const reservas = Array.isArray(data) ? data : data.reservas || [];

                if (reservas.length === 0) {
                    mostrarVazio();
                } else {
                    mostrarReservas(reservas);
                }
            } else {
                mostrarVazio();
            }
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            mostrarVazio();
        }
    }

    function mostrarVazio() {
        reservasList.innerHTML = `
            <div class="reservas-vazio">
                <i class="fas fa-calendar-times"></i>
                <p>Você ainda não tem nenhuma reserva</p>
                <a href="reserva.html" class="btn-nova-reserva">
                    <i class="fas fa-plus"></i> Fazer uma Reserva
                </a>
            </div>
        `;
    }

    function mostrarReservas(reservas) {
        reservasList.innerHTML = '';

        reservas.forEach(reserva => {
            const dataReserva = new Date(reserva.data);
            const dataFormatada = dataReserva.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const statusClass = `status-${reserva.status || 'pendente'}`;
            const statusText = {
                pendente: 'Pendente',
                confirmada: 'Confirmada',
                cancelada: 'Cancelada'
            }[reserva.status] || 'Pendente';

            const observacoesHTML = reserva.observacoes 
                ? `<div class="reserva-observacoes"><strong>Observações:</strong> ${reserva.observacoes}</div>`
                : '';

            const card = document.createElement('div');
            card.className = 'reserva-card';
            card.innerHTML = `
                <div class="reserva-card-header">
                    <h3>${reserva.nome}</h3>
                    <span class="reserva-status ${statusClass}">${statusText}</span>
                </div>

                <div class="reserva-info-grid">
                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">Data</div>
                            <div class="reserva-info-value">${dataFormatada}</div>
                        </div>
                    </div>

                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">Horário</div>
                            <div class="reserva-info-value">${reserva.horario}</div>
                        </div>
                    </div>

                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">Pessoas</div>
                            <div class="reserva-info-value">${reserva.pessoas}</div>
                        </div>
                    </div>

                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">E-mail</div>
                            <div class="reserva-info-value">${reserva.email}</div>
                        </div>
                    </div>

                    ${reserva.telefone ? `
                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">Telefone</div>
                            <div class="reserva-info-value">${reserva.telefone}</div>
                        </div>
                    </div>
                    ` : ''}

                    ${reserva.preferencia ? `
                    <div class="reserva-info-item">
                        <div class="reserva-info-icon">
                            <i class="fas fa-chair"></i>
                        </div>
                        <div class="reserva-info-content">
                            <div class="reserva-info-label">Preferência de Mesa</div>
                            <div class="reserva-info-value">
                                ${reserva.preferencia === 'janela' ? 'Perto da Janela' : 
                                  reserva.preferencia === 'canto' ? 'Canto' : 
                                  reserva.preferencia === 'centro' ? 'Centro' : reserva.preferencia}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>

                ${observacoesHTML}
            `;

            reservasList.appendChild(card);
        });
    }

    // Carregar ao abrir a página
    carregarReservas();

    // Recarregar a cada 5 segundos para atualizar status
    setInterval(carregarReservas, 5000);
});
