// filepath: /home/sento/HispanoTech-UGC-WEB/config/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pynqyypeepucyrrmncpi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnF5eXBlZXB1Y3lycm1uY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY4MTUsImV4cCI6MjA1OTg1MjgxNX0.snRvFKlyvlNKRbiduOR2NfXDXeMjqn_2mvJGXSafdIY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function verificarConexion() {
  try {
    const { error } = await supabase.from('usuarios').select('*');
    if (error) {
      console.error('Error al conectar: ' + error.message);
      return false;
    } else {
      console.log('Conexión a la base de datos exitosa');
      return true;
    }
  } catch (err) {
    console.error('Error inesperado al verificar la conexión:', err);
    return false;
  }
}