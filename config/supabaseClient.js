// filepath: /home/sento/HispanoTech-UGC-WEB/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pynqyypeepucyrrmncpi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnF5eXBlZXB1Y3lycm1uY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY4MTUsImV4cCI6MjA1OTg1MjgxNX0.snRvFKlyvlNKRbiduOR2NfXDXeMjqn_2mvJGXSafdIY';
let conexion = false; // Cambiado de const a let

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verificarConexion() {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) {
    console.error('Error al conectar: ' + error.message);
    conexion = false;
  } else {
    console.log('supabaseClient.js: conexiÃ³n a la base de datos exitosa');
    conexion = true;
  }
}

verificarConexion();