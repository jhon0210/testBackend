import dotenv from 'dotenv';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { obtenerToken } from '../src/controllers/hoteles.controller';

dotenv.config();

describe('Pruebas para obtenerToken', () => {
    const mock = new MockAdapter(axios);
    const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';

    afterEach(() => {
        mock.reset();
    });

    it('debería obtener un token de acceso correctamente', async () => {
        

        mock.onPost(tokenUrl).reply(200, { access_token: 'mock_token' });

        const token = await obtenerToken();
        console.log(token);
        expect(token).toBe('mock_token');
    });

    it('debería lanzar un error si la solicitud falla', async () => {
        // Simular error de la API
        mock.onPost(tokenUrl).reply(400, { error: 'Invalid credentials' });

        await expect(obtenerToken()).rejects.toThrow("No se pudo obtener el token de Amadeus");
    });

    it('debería manejar errores de red', async () => {
        // Simular un fallo de red
        mock.onPost(tokenUrl).networkError();

        await expect(obtenerToken()).rejects.toThrow("No se pudo obtener el token de Amadeus");
    });
});
