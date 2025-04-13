// filepath: /home/sento/HispanoTech-UGC-WEB/config/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
let conexion = false; // Cambiado de const a let

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await supabase.from('usuarios').select('*');
if (error) {
    console.error('Error al conectar: ' + error.message);
    conexion = false; // Ahora es válido porque usamos let
} else {
    console.log('supabaseClient.js: conexión a la base de datos exitosa');
    conexion = true; // Ahora es válido porque usamos let
}