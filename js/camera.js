import { subirImagenASupabase } from '../services/supa_operator.js'

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

export function removePath(){
    path = null
    alert('Path eliminado')
}

export function hacerFoto() {
    if (!path) {
        alert('Primero establece un path.')
        return
    }

    const img = document.getElementById('cameraFeed')

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const now = new Date()
    const timestamp = now.toISOString()
        .replace(/:/g, '-')       // reemplaza ":" para evitar problemas en nombres de archivo
        .replace(/\..+/, '')      // quita milisegundos y zona horaria
        .replace('T', '_')        // opcional: más legible

    const fileName = `captura-${timestamp}.png`

    canvas.toBlob(async (blob) => {
        if (blob) {
            try {
                await subirImagenASupabase(blob, `${path}/${fileName}`)
            } catch (err) {
                alert('Error al subir la imagen.')
                console.error(err)
            }
        }
    }, 'image/png')
}

window.setPath = setPath
window.removePath = removePath
window.hacerFoto = hacerFoto

