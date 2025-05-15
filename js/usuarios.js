import { supabase } from '../config/supabaseClient';

export async function getUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) throw error;
  return data;
}

export async function addUsuario(usuario) {
  const { data, error } = await supabase.from('usuarios').insert([usuario]);
  if (error) throw error;
  return data;
}

export async function deleteUsuario(id) {
  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) throw error;
}