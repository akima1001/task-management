import request from 'supertest'
import app from './app'

describe('server test', () => {
  it('/', async () => {
    const response = await request(app).get('/')

    expect(response.statusCode).toBe(200)
  })
})
