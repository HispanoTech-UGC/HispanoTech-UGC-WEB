import { jest } from '@jest/globals';

// Usa el mock automático de Jest
jest.mock('../config/supabaseClient.js');

import {
    getUsers,
    editUser,
    getCuerpos,
    getUsersByCuerpo,
    getUserByPlaca,
    getCuerpoId,
    deleteUser
} from '../services/supa_admin';

describe('Servicios Supabase', () => {
    test('getUsers devuelve usuarios', async () => {
        const res = await getUsers();
        expect(res.length).toBeGreaterThan(0);
    });

    test('editUser actualiza usuario correctamente', async () => {
        const res = await editUser({ num_placa: 'CNP001', rol: 2 });
        expect(res.success).toBe(true);
    });

    test('getCuerpos retorna datos', async () => {
        const res = await getCuerpos();
        expect(res[0].cuerpo).toBe('Unidad X');
    });

    test('getUsersByCuerpo filtra correctamente', async () => {
        const res = await getUsersByCuerpo(2);
        expect(res.length).toBeGreaterThan(0);
    });

    test('getUserByPlaca busca por patrón', async () => {
        const res = await getUserByPlaca('003');
        expect(res.success).toBe(true);
    });

    test('getCuerpoId devuelve cuerpo', async () => {
        const res = await getCuerpoId(1);
        expect(res).toBe('Unidad Z');
    });

    test('deleteUser elimina usuario e informes', async () => {
        const res = await deleteUser('CNP004');
        expect(res.success).toBe(true);
    });
});
