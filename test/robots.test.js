import { supabase } from '../config/supabaseClient';

describe('Pruebas para la tabla robots', () => {
  beforeEach(async () => {
    await supabase.from('robots').delete().eq('modelo', 'Modelo Test 5');
  });

  test('Agregar y eliminar un robot', async () => {
    const nuevoRobot = {
      modelo: 'Modelo Test 5',
      url: 'http://robot.test',
    };

    const { data: insertData, error: insertError } = await supabase
    .from('robots')
    .insert([nuevoRobot])
    .select();
  
    expect(insertError).toBeNull();
    expect(insertData).not.toBeNull();
    expect(insertData).toHaveLength(1);
    expect(insertData[0].modelo).toBe('Modelo Test 5');

    const { error: deleteError } = await supabase.from('robots').delete().eq('modelo', 'Modelo Test 5');
    expect(deleteError).toBeNull();
  });
});
