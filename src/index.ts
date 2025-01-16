import express from 'express';
import prisma from '../client';
import { ship } from './shipping';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/ship', async (req: any, res: any) => {
  const { deviceId, quantity, lat, lng, saveOrder } = req.body;

  if (!deviceId || !quantity || !lat || !lng) {
    return res.status(400).json({
      isValid: false,
      error: 'Missing required fields: deviceId, quantity, lat, lng are required'
    });
  }

  try {
    const order = await ship(
      Number(deviceId),
      Number(quantity),
      Number(lat),
      Number(lng),
      saveOrder === 'true'
    );

    if (!order) {
      return res.status(400).json({
        isValid: false,
        error: 'No valid shipping options found'
      });
    }

    res.status(200).json({
      isValid: true,
      order: order
    });

  } catch (error: any) {
    res.status(400).json({
      isValid: false,
      error: error.message
    });
  }
});

app.get('/devices', async (_req: any, res: any) => {
  try {
    const devices = await prisma.device.findMany();
    res.status(200).json(devices);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch devices',
      details: error.message
    });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
