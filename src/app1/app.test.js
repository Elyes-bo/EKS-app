const request = require('supertest');
const app = require('./app'); // Make sure to export 'app' in your app.js file

describe('App', () => {
  describe('GET /fibonacci', () => {
    it('should return the 13th Fibonacci number', async () => {
      const response = await request(app).get('/fibonacci');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('<h1>233</h1>');
    });
  });

  describe('GET /', () => {
    it('should return "Hello world!"', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('<h1>Hello world !</h1>');
    });
  });

  describe('GET /health', () => {
    it('should return application health status', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Application is healthy'
      });
    });
  });

  describe('GET /readiness', () => {
    it('should return application readiness status', async () => {
      const response = await request(app).get('/readiness');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 'ready',
        message: 'Application is ready to serve traffic'
      });
    });
  });
});
