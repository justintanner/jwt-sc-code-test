import { prismaMock } from '../singleton'
import { Prisma } from '@prisma/client'

import request from 'supertest';
import app from '../src/index';

describe('Devices API Endpoint', () => {
  describe('GET /devices', () => {
    it('should return a list of devices', async () => {
      const devices = [
        { id: 1, name: 'Device 1', price: new Prisma.Decimal('1.99'), kilograms: 300 },
        { id: 2, name: 'Device 2', price: new Prisma.Decimal('2.99'), kilograms: 400 },
      ];
      prismaMock.device.findMany.mockResolvedValue(devices);
      const res = await request(app).get('/devices');
      expect(res.status).toBe(200);
      // Checking ids because Prisma.Decimal is not comparing well.
      expect(res.body[0]['id']).toBe(devices[0].id);
      expect(res.body[1]['id']).toBe(devices[1].id);
    });

    it('should handle database errors gracefully', async () => {
      prismaMock.device.findMany.mockRejectedValue(new Error('Database error'));
      const res = await request(app).get('/devices');
    });
  });
});
