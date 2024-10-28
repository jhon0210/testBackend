import express from 'express';
import hotelesRoutes from './routes/hoteles.routes.js';
const app = express();
app.use(express.json());
app.use('/api', hotelesRoutes);
export default app;
