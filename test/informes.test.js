import { supabase } from '../config/supabaseClient';

describe('Pruebas para la tabla informes', () => {
  beforeEach(async () => {
    // Asegurar que existe el usuario
    const { error: userError } = await supabase.from('usuarios').upsert({
      num_placa: '12348',
      password: 'password123',
      rol: 1,
      cuerpo: 1,
    });
    expect(userError).toBeNull();

    // Asegurar que existe el robot
    const { error: robotError } = await supabase.from('robots').upsert({
      robot_id: 1,
      modelo: 'Modelo Test',
      url: 'http://example.com',
    });
    expect(robotError).toBeNull();

    // Limpiar posibles informes anteriores
    const { error: deleteError } = await supabase
      .from('informes')
      .delete()
      .eq('titulo_informe', 'Informe de prueba');
    expect(deleteError).toBeNull();
  });

  test('Agregar y eliminar un informe', async () => {
    const nuevoInforme = {
      titulo_informe: 'Informe de prueba',
      num_placa: '12348',
      robot_id: 1,
      fecha_ini: new Date().toISOString(),
      fecha_fin: new Date().toISOString(),
    };

    const { data: insertData, error: insertError } = await supabase
      .from('informes')
      .insert([nuevoInforme])
      .select();

    expect(insertError).toBeNull();
    expect(insertData).not.toBeNull();
    expect(insertData).toHaveLength(1);
    expect(insertData[0].titulo_informe).toBe('Informe de prueba');

    const { error: deleteError } = await supabase
      .from('informes')
      .delete()
      .eq('titulo_informe', 'Informe de prueba');

    expect(deleteError).toBeNull();
  });
});
