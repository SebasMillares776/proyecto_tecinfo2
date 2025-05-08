document.addEventListener('DOMContentLoaded', function() {
    const imagenes = document.querySelectorAll('.imagen-contenedor');

    imagenes.forEach(imagen => {
        imagen.addEventListener('click', function() {
            const imageUrl = this.querySelector('img').src;
            alert(`¡Clic en la imagen! URL: ${imageUrl}`);
            // Aquí puedes agregar más interactividad, como abrir un modal con la imagen grande
        });
    });
});