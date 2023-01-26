import request from 'supertest'
import server from './app'

describe('server test', () => {
  it('/', async () => {
    const response = await request(server).get('/')

    expect(response.statusCode).toBe(200)
  })
})
