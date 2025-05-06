import { subirImagenASupabase } from '../services/supa_operator'

const user = JSON.parse(localStorage.getItem('usuario'))
let path = null

export function setPath()
{
    console.log('entrando a set path')
    if (user && user.num_placa) {
        const randomCode = Math.floor(1000 + Math.random() * 9000)
        path = `${user.num_placa}/${randomCode}`
        alert(`Path establecido: ${path}`)
    } else {
        alert('No se pudo establecer path: usuario no definido')
    }
}

document.getElementById('clear-path').addEventListener('click', () => {
    path = null
    alert('Path eliminado')
})

export function hacerFoto() {
    if (!path) {
        alert('Primero establece un path.')
        return
    }

    const canvas = document.getElementById('map')
    canvas.toBlob(async (blob) => {
        if (blob) {
            try {
                await subirImagenASupabase(blob, `${path}/captura.png`)
            } catch (err) {
                alert('Error al subir la imagen.')
            }
        }
    }, 'image/png')
}

window.setPath = setPath
window.hacerFoto = hacerFoto

