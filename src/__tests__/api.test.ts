import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  // Test credentials from .env.example
  const TEST_USER = process.env.BASIC_AUTH_USER || 'admin';
  const TEST_PASS = process.env.BASIC_AUTH_PASSWORD || 'password';
  const auth = Buffer.from(`${TEST_USER}:${TEST_PASS}`).toString('base64');

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('POST /estimate', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/estimate')
        .send({ dish: 'Pasta' });
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing dish name', async () => {
      const res = await request(app)
        .post('/estimate')
        .set('Authorization', `Basic ${auth}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return carbon estimate for a dish', async () => {
      const res = await request(app)
        .post('/estimate')
        .set('Authorization', `Basic ${auth}`)
        .send({ dish: 'Chicken Biryani' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('dish');
      expect(res.body).toHaveProperty('estimated_carbon_kg');
      expect(res.body.estimated_carbon_kg).toBeGreaterThan(0);
    });
  });

  describe('POST /upload', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/upload')
        .attach('image', Buffer.from('test'), 'test.jpg');
      expect(res.status).toBe(401);
    });

    it('should return 400 for missing image', async () => {
      const res = await request(app)
        .post('/upload')
        .set('Authorization', `Basic ${auth}`);
      expect(res.status).toBe(400);
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger UI', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Swagger UI');
    });

    it('should serve OpenAPI spec', async () => {
      const res = await request(app).get('/api-docs.json');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('openapi', '3.0.0');
      expect(res.body.info.title).toBe('Carbon Footprint API');
    });
  });
});
