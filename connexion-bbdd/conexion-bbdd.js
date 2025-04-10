import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://pynqyypeepucyrrmncpi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bnF5eXBlZXB1Y3lycm1uY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY4MTUsImV4cCI6MjA1OTg1MjgxNX0.snRvFKlyvlNKRbiduOR2NfXDXeMjqn_2mvJGXSafdIY'
const conexion = false;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

//const p = document.getElementById('conexion')
const { data, error } = await supabase.from('usuarios').select('*')
if (error) {
    //p.textContent = 'Error al conectar: ' + error.message
    console.error(error)
    conexion=false;
} else {
    //p.textContent = 'Conectado. Filas recibidas: ' + data.length
    conexion=true;
}