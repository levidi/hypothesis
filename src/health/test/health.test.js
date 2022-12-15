const request = require('supertest')

const app = require('../../app')

describe('Test Health Check', () => {

    test('test health', (done) => {
        request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe('OK')
            })
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })
})