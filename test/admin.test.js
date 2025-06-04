import * as supaAdmin from '../services/supa_admin.js';
import { supabase } from '../config/supabaseClient.js';

jest.mock('../config/supabaseClient.js', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('supa_admin functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        test('devuelve usuarios cuando hay datos', async () => {
            const mockData = [
                { num_placa: '001', rol: 'admin', cuerpo: 1 },
                { num_placa: '002', rol: 'user', cuerpo: 2 },
            ];
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
                ilike: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            });

            const result = await supaAdmin.getUsers();
            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('usuarios');
        });

        test('devuelve mensaje si no hay usuarios', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: [], error: null }),
            });

            const result = await supaAdmin.getUsers();
            expect(result).toEqual({ success: false, message: 'No se encontraron usuarios.' });
        });

        test('devuelve mensaje si hay error', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
            });

            const result = await supaAdmin.getUsers();
            expect(result).toEqual({ success: false, message: 'Error al acceder a la base de datos.' });
        });
    });

    describe('editUser', () => {
        test('actualiza usuario correctamente', async () => {
            const updatedUser = { num_placa: 'CPP1122', rol: 'superadmin' };
            const mockResponseData = [updatedUser];

            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: mockResponseData, error: null }),
                    }),
                }),
            });

            const result = await supaAdmin.editUser(updatedUser);
            expect(result).toEqual({
                success: true,
                message: 'Usuario actualizado correctamente.',
                user: updatedUser,
            });
        });

        test('falla si no se envía num_placa', async () => {
            const updatedUser = { rol: 'superadmin' };
            const result = await supaAdmin.editUser(updatedUser);
            expect(result).toEqual({
                success: false,
                message: 'El campo num_placa es obligatorio para editar el usuario.',
            });
        });

        test('maneja error de actualización', async () => {
            const updatedUser = { num_placa: '123', rol: 'superadmin' };

            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: null, error: { message: 'update error' } }),
                    }),
                }),
            });

            const result = await supaAdmin.editUser(updatedUser);
            expect(result.success).toBe(false);
            expect(result.message).toBe('Error al actualizar el usuario.');
            expect(result.details).toBeDefined();
        });

        test('maneja usuario no encontrado en update', async () => {
            const updatedUser = { num_placa: '123', rol: 'superadmin' };

            supabase.from.mockReturnValue({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockResolvedValue({ data: [], error: null }),
                    }),
                }),
            });

            const result = await supaAdmin.editUser(updatedUser);
            expect(result).toEqual({
                success: false,
                message: 'No se encontró ningún usuario con ese num_placa.',
            });
        });
    });

    /*describe('getCuerpos', () => {
        test('devuelve cuerpos cuando hay datos', async () => {
            const mockData = [{ id: 5, cuerpo: 'Cuerpo 1' }, { id: 2, cuerpo: 'Cuerpo 2' }];

            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            });

            const result = await supaAdmin.getCuerpos();
            expect(result).toEqual(mockData);
        });

        test('devuelve mensaje si no hay cuerpos', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: [], error: null }),
            });

            const result = await supaAdmin.getCuerpos();
            expect(result).toEqual({ success: false, message: 'No se encontraron cuerpos.' });
        });

        test('devuelve mensaje si hay error', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({ data: null, error: { message: 'error' } }),
            });

            const result = await supaAdmin.getCuerpos();
            expect(result).toEqual({ success: false, message: 'Error al acceder a la base de datos.' });
        });
    });*/

    describe('getUsersByCuerpo', () => {
        test('devuelve usuarios filtrados por cuerpo', async () => {
            const id = 5;
            const mockData = [{ num_placa: 'CNP1122', cuerpo: id }];

            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
                }),
            });

            const result = await supaAdmin.getUsersByCuerpo(id);
            expect(result).toEqual(mockData);
        });

        test('devuelve mensaje si no hay datos', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                }),
            });

            const result = await supaAdmin.getUsersByCuerpo(5);
            expect(result).toEqual({ success: false, message: 'No se encontraron datos del cuerpo.' });
        });

        test('devuelve mensaje si hay error', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'error' } }),
                }),
            });

            const result = await supaAdmin.getUsersByCuerpo(5);
            expect(result).toEqual({ success: false, message: 'Error al acceder a la base de datos.' });
        });
    });

    /*describe('getUserByPlaca', () => {
        test('devuelve usuario filtrado por placa', async () => {
            const placa = 'abc';
            const mockData = [{ num_placa: 'abc123', rol: 'user' }];

            supabase.from.mockReturnValue({
                ilike: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            });

            const result = await supaAdmin.getUserByPlaca(placa);
            expect(result).toEqual({ success: true, message: mockData });
        });

        test('devuelve mensaje si no hay datos', async () => {
            supabase.from.mockReturnValue({
                ilike: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            });

            const result = await supaAdmin.getUserByPlaca('xyz');
            expect(result).toEqual({ success: false, message: 'No se encontraron datos del usuario.' });
        });

        test('devuelve mensaje si hay error', async () => {
            supabase.from.mockReturnValue({
                ilike: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            });

            const result = await supaAdmin.getUserByPlaca('xyz');
            expect(result).toEqual({ success: false, message: 'Error al acceder a la base de datos.' });
        });
    });*/

    describe('getCuerpoId', () => {
        test('devuelve cuerpo por id', async () => {
            const id = 5;
            const mockData = [{ id: id, cuerpo: 'CuerpoX' }];

            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
                }),
            });

            const result = await supaAdmin.getCuerpoId(id);
            expect(result).toBe('CuerpoX');
        });

        test('devuelve mensaje si no hay datos', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                }),
            });

            const result = await supaAdmin.getCuerpoId(5);
            expect(result).toEqual({ success: false, message: 'No se encontraron datos del cuerpo.' });
        });

        test('devuelve mensaje si hay error', async () => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'error' } }),
                }),
            });

            const result = await supaAdmin.getCuerpoId(5);
            expect(result).toEqual({ success: false, message: 'Error al acceder a la base de datos.' });
        });
    });

    describe('deleteUser', () => {
        test('elimina informes y usuario exitosamente', async () => {
            const placa = '123';

            supabase.from.mockImplementation((table) => {
                if (table === 'informes') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
                        }),
                    };
                }
                if (table === 'usuarios') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: [{ num_placa: placa }], error: null }),
                        }),
                    };
                }
                return {};
            });

            const result = await supaAdmin.deleteUser(placa);
            expect(result).toEqual({
                success: true,
                message: 'Usuario y sus informes eliminados exitosamente.',
            });
        });

        test('error al eliminar informes', async () => {
            supabase.from.mockImplementation((table) => {
                if (table === 'informes') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'err' } }),
                        }),
                    };
                }
                return {};
            });

            const result = await supaAdmin.deleteUser('CNP1122');
            expect(result).toEqual({
                success: false,
                message: 'Error al eliminar los informes relacionados.',
            });
        });

        test('error al eliminar usuario', async () => {
            supabase.from.mockImplementation((table) => {
                if (table === 'informes') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
                        }),
                    };
                }
                if (table === 'usuarios') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'err' } }),
                        }),
                    };
                }
                return {};
            });

            const result = await supaAdmin.deleteUser('CNP1122');
            expect(result).toEqual({
                success: false,
                message: 'Error al eliminar el usuario.',
            });
        });

        test('no se encontraron datos para eliminar', async () => {
            supabase.from.mockImplementation((table) => {
                if (table === 'informes') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
                        }),
                    };
                }
                if (table === 'usuarios') {
                    return {
                        delete: jest.fn().mockReturnValue({
                            eq: jest.fn().mockResolvedValue({ data: null, error: null }),
                        }),
                    };
                }
                return {};
            });

            const result = await supaAdmin.deleteUser('123');
            expect(result).toEqual({
                success: false,
                message: 'No se encontraron usuarios o informes con esa placa.',
            });
        });
    });
});
