document.addEventListener('DOMContentLoaded', function() {
    const canvaButton = document.getElementById('canvaButton');

    // URL del enlace a Canva
    const canvaURL = 'https://www.canva.com/your-canva-project-link'; // ¡IMPORTANTE: REEMPLAZA ESTO CON TU ENLACE REAL DE CANVA!

    if (canvaButton) {
        canvaButton.addEventListener('click', function() {
            // Abrir el enlace en una nueva pestaña
            window.open(canvaURL, '_blank');
        });
    } else {
        console.error('El botón con el ID "canvaButton" no fue encontrado en el DOM.');
    }
});
