var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const querySchema = z.object({
    hotelIds: z.string().min(1, "hotelIds es requerido"),
    checkInDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "checkInDate debe ser una fecha válida",
    }),
    checkOutDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "checkOutDate debe ser una fecha válida",
    }),
    adults: z.string().regex(/^\d+$/, "Adults debe ser un número entero"),
    roomQuantity: z.string().regex(/^\d+$/, "RoomQuantity debe ser un número entero"),
});
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    throw new Error("Las credenciales de Amadeus no están definidas");
}
export const obtenerToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", new URLSearchParams({
            grant_type: "client_credentials",
            client_id: AMADEUS_CLIENT_ID,
            client_secret: AMADEUS_CLIENT_SECRET
        }).toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return response.data.access_token;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error al obtener el token de Amadeus:", error.response ? error.response.data : error.message);
            throw new Error("No se pudo obtener el token de Amadeus");
        }
        else {
            console.error("Error desconocido al obtener el token:", error);
            throw new Error("Error desconocido al obtener el token de Amadeus");
        }
    }
});
export const hotelesDisponibles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedQuery = querySchema.parse(req.query);
        const { hotelIds, checkInDate, checkOutDate, adults, roomQuantity } = validatedQuery;
        const token = yield obtenerToken();
        const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomQuantity=${roomQuantity}&paymentPolicy=NONE&bestRateOnly=true`;
        const response = yield axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const hotels = response.data.data.map((hotel) => ({
            name: hotel.hotel.name || "Nombre no disponible",
            rating: hotel.hotel.rating || null,
            address: hotel.hotel.address && hotel.hotel.address.lines
                ? hotel.hotel.address.lines.join(", ")
                : "Dirección no disponible",
            price: {
                currency: hotel.offers[0].price.currency,
                amount: parseFloat(hotel.offers[0].price.total)
            },
            roomsAvailable: hotel.offers.length
        }));
        res.json({
            hotelIds,
            checkInDate,
            checkOutDate,
            hotels
        });
    }
    catch (error) {
        console.error("Error en la solicitud de disponibilidad de hoteles:", error);
        res.status(400).json({ error: error instanceof z.ZodError ? error.errors : "Error al obtener disponibilidad de hoteles" });
    }
});
