import { subirImagenASupabase, subirFotoADatabase } from '../services/supa_operator.js';
import { supabase } from '../config/supabaseClient.js';

jest.mock('../config/supabaseClient.js', () => ({
    supabase: {
        storage: {
            from: jest.fn()
        },
        from: jest.fn()
    }
}));

describe('subirImagenASupabase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('sube imagen correctamente a storage y base de datos', async () => {
        const mockUpload = jest.fn().mockResolvedValue({
            data: { path: 'user123/5678/captura.png' },
            error: null
        });

        const mockInsertImagen = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
                data: [{ imagen_id: 42, url: 'user123/5678/captura.png' }],
                error: null
            })
        });

        const mockInsertRelacion = jest.fn().mockResolvedValue({ error: null });

        supabase.storage.from.mockReturnValue({ upload: mockUpload });
        supabase.from.mockImplementation((table) => {
            if (table === 'imagen') {
                return { insert: mockInsertImagen };
            } else if (table === 'informe-imagen') {
                return { insert: mockInsertRelacion };
            }
        });

        const blob = new Blob(['dummy content'], { type: 'image/png' });
        const result = await subirImagenASupabase(blob, 'user123/5678/captura.png', 10);

        expect(result.path).toBe('user123/5678/captura.png');
        expect(mockUpload).toHaveBeenCalled();
        expect(mockInsertImagen).toHaveBeenCalled();
        expect(mockInsertRelacion).toHaveBeenCalled();
    });
});
