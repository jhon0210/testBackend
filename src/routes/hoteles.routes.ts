import { Router } from "express";

import {hotelesDisponibles} from '../controllers/hoteles.controller.js';

const router = Router();

router.get('/hotels', hotelesDisponibles)

export default router;