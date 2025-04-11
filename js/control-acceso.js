// Control de acceso por rol a páginas
//-----------------------------------------------------
//---id_usuario:N--->control-acceso()------------------
(async (script) => {
    const user = JSON.parse(localStorage.getItem('usuario'));

    if (!user) {
        location.href = '../login.html';
        return;
    }

    try {
        const roles = [user.rol];
        console.log(roles);
        if (script.dataset && script.dataset.rolesRestringidos) {
            console.log(script.dataset.rolesRestringidos)
            const rolesRestringidos = script.dataset.rolesRestringidos.split(',').map(Number);
            if (roles.some(rol => rolesRestringidos.includes(rol))) {
                //alert('Permisos insuficientes para acceder a la página');
                location.href = '../login.html';
                return;
            }
        }

        // Actualizar el nombre del usuario si es necesario
        // document.getElementById('user-name').innerText = data.Usuario;
        document.body.classList.remove("loading");
        console.log('acceso correcto')
        // Comprobar si existe una función init y si es así, ejecutarla
        if (window.init) await window.init();
    } catch (error) {
        console.error('Error al obtener los roles del usuario:', error);
        //location.href = '../login.html'; // Redirigir en caso de error
    }
})(document.currentScript);
// Control de acceso por rol a páginas
//-----------------------------------------------------
//---------------------logOut()------------------------
function logOut(){
    localStorage.clear();  //borra el almacenamiento local
    location.href = '../login.html';  //redirige a login
}
