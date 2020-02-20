import request from 'supertest';
import app from '../../index';

describe('INVALID URL 404', () => {
  it('Should throw a 404 when user enters an Invalid URL', async () => {
    const response = await request(app).get('/api/invalidurl');
    expect(response.status).toEqual(404);
  });
});
