if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
}

window.showToast = function(msg, type = 'info') {
    // ... (o código que te passei antes) ...
    // Se precisar, copio novamente aqui embaixo
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let icon = 'fa-info-circle';
    let border = 'var(--gold)';
    
    if (type === 'success') { icon = 'fa-check-circle'; border = '#22c55e'; }
    if (type === 'error') { icon = 'fa-exclamation-triangle'; border = '#ef4444'; }

    toast.className = `toast ${type}`;
    toast.style.borderLeftColor = border;
    toast.innerHTML = `<i class="fas ${icon}" style="color:${border}"></i> <span>${msg}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}