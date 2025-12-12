document.addEventListener('DOMContentLoaded', async () => {
    const lista = document.getElementById('reservas-list');

    try {
        const res = await fetch('/api/reservas');
        const reservas = await res.json();

        if (reservas.length === 0) {
            lista.innerHTML = '<p style="text-align:center">Nenhuma reserva encontrada.</p>';
            return;
        }

        lista.innerHTML = '';
        
        reservas.forEach(r => {
            // Formatar Data
            const dateObj = new Date(r.data);
            const dia = dateObj.getUTCDate();
            const mes = dateObj.toLocaleString('pt-BR', { month: 'short' });

            const ticket = document.createElement('div');
            ticket.className = 'reserva-ticket';
            ticket.innerHTML = `
                <div class="ticket-left">
                    <span class="ticket-date-day">${dia}</span>
                    <span class="ticket-date-month">${mes}</span>
                </div>
                <div class="ticket-right">
                    <span class="status-badge status-${r.status}">${r.status}</span>
                    <h3 style="margin:0; color:var(--gold)">Reserva #${r.id.toString().slice(-4)}</h3>
                    
                    <div class="ticket-info-grid">
                        <div>
                            <div class="ticket-label">Horário</div>
                            <div class="ticket-value">${r.horario}</div>
                        </div>
                        <div>
                            <div class="ticket-label">Pessoas</div>
                            <div class="ticket-value">${r.pessoas} Lugares</div>
                        </div>
                        <div>
                            <div class="ticket-label">Ambiente</div>
                            <div class="ticket-value">${r.preferencia || 'Padrão'}</div>
                        </div>
                    </div>
                </div>
            `;
            lista.appendChild(ticket);
        });

    } catch (error) {
        console.error(error);
        lista.innerHTML = '<p>Erro ao carregar reservas.</p>';
    }
});