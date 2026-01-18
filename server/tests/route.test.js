const request = require('supertest');
const app = require('../index');
const axios = require('axios');

jest.mock('axios');

describe('GET /api/route', () => {
  it('should return 400 if start or end are missing', async () => {
    const res = await request(app).get('/api/route');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return route data when coordinates are provided', async () => {
    const mockData = { routes: [{ distance: 100, duration: 10 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const res = await request(app).get('/api/route?start=10,10&end=20,20');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockData);
  });

  it('should handle OSRM API errors', async () => {
    axios.get.mockRejectedValue(new Error('OSRM Error'));

    const res = await request(app).get('/api/route?start=10,10&end=20,20');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });
});
