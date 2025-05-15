function actualizarReloj() {
    const reloj = document.getElementById('reloj');
    const ahora = new Date();

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diaSemana = dias[ahora.getDay()];
    const diaMes = ahora.getDate();
    const mes = meses[ahora.getMonth()];

    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    reloj.textContent = `${diaSemana}, ${diaMes} de ${mes} - ${horas}:${minutos}:${segundos}`;
}

actualizarReloj(); // Al iniciar
setInterval(actualizarReloj, 1000); // Cada segundo