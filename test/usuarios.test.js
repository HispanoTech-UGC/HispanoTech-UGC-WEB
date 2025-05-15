import { supabase } from '../config/supabaseClient';

describe('Pruebas para la tabla usuarios', () => {
  beforeEach(async () => {
    await supabase.from('usuarios').delete().eq('num_placa', '12348');
  });

  test('Agregar y eliminar un usuario', async () => {
    const nuevoUsuario = {
      num_placa: '12348',
      password: 'password123',
      rol: 1,
      cuerpo: 1,
    };

    const { data: insertData, error: insertError } = await supabase
    .from('usuarios')
    .insert([nuevoUsuario])
    .select(); // ← fuerza que devuelva los datos insertados
  
    expect(insertError).toBeNull();
    expect(insertData).not.toBeNull();
    expect(insertData).toHaveLength(1);
    expect(insertData[0].num_placa).toBe('12348');

    const { error: deleteError } = await supabase.from('usuarios').delete().eq('num_placa', '12348');
    expect(deleteError).toBeNull();
  });
});
