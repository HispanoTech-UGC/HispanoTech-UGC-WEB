// test/informes.test.js
import { supabase } from '../config/supabaseClient.js';
import {
    crearInforme,
    finalizarInforme,
    getMisInformes,
    getInformesCuerpo,
    getInformesImages,
    getIncidenteByInforme,
    actualizarIncidente,
    actualizarInforme
} from '../services/supa_informs.js';

jest.mock('../config/supabaseClient.js', () => ({
    supabase: {
        from: jest.fn()
    }
}));

beforeAll(() => {
    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    };
});


describe('Funciones de informes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('crearInforme debe insertar y devolver informe', async () => {
        supabase.from.mockReturnValue({
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    data: [{ id: 1, titulo_informe: 'Informe A' }],
                    error: null
                })
            })
        });

        const res = await crearInforme('2025-06-01', 'ABC123', 1, 'Informe A');
        expect(res.success).toBe(true);
        expect(res.informe.titulo_informe).toBe('Informe A');
    });

    test('finalizarInforme debe actualizar y devolver informe finalizado', async () => {
        supabase.from.mockReturnValue({
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    select: jest.fn().mockResolvedValue({
                        data: [{ informe_id: 1, fecha_fin: '2025-06-01' }],
                        error: null
                    })
                })
            })
        });

        const res = await finalizarInforme(1);
        expect(res.success).toBe(true);
        expect(res.informe.informe_id).toBe(1);
    });

    test('getMisInformes devuelve informes de un agente', async () => {
        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [{ informe_id: 10 }],
                    error: null
                })
            })
        });

        const res = await getMisInformes('ABC123');
        expect(res[0].informe_id).toBe(10);
    });

    test('getInformesCuerpo filtra por prefijo de placa', async () => {
        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                like: jest.fn().mockResolvedValue({
                    data: [{ num_placa: 'CNP001' }],
                    error: null
                })
            })
        });

        const res = await getInformesCuerpo('CNP');
        expect(res[0].num_placa).toMatch(/^CNP/);
    });

    test('getInformesImages devuelve imágenes relacionadas', async () => {
        supabase.from.mockImplementation((table) => {
            if (table === 'informe-imagen') {
                return {
                    select: jest.fn(() => ({
                        eq: jest.fn().mockResolvedValue({
                            data: [{ imagen_id: 1 }, { imagen_id: 2 }],
                            error: null
                        })
                    }))
                };
            } else if (table === 'imagen') {
                return {
                    select: jest.fn(() => ({
                        in: jest.fn().mockResolvedValue({
                            data: [
                                { url: 'image1.jpg' },
                                { url: 'image2.jpg' }
                            ],
                            error: null
                        })
                    }))
                };
            }
        });

        const res = await getInformesImages(1);
        expect(res.length).toBe(2);
        expect(res[0].url).toContain('image');
    });


    test('getIncidenteByInforme crea nuevo si no existe', async () => {
        supabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: [],
                    error: null
                })
            }),
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    data: [{ informeId: 1 }],
                    error: null
                })
            })
        });

        const res = await getIncidenteByInforme(1);
        expect(res[0].informeId).toBe(1);
    });

    test('actualizarIncidente retorna true al actualizar sin error', async () => {
        supabase.from.mockReturnValue({
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null })
            })
        });

        const res = await actualizarIncidente(1, { LugarIncidente: 'Zona A' });
        expect(res).toBe(true);
    });

    test('actualizarInforme retorna true al actualizar sin error', async () => {
        supabase.from.mockReturnValue({
            update: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null })
            })
        });

        const res = await actualizarInforme(1, { titulo_informe: 'Actualizado' });
        expect(res).toBe(true);
    });
});
