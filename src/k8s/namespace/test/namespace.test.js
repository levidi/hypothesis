const request = require('supertest')
const { v4: uuidv4 } = require('uuid');
const app = require('../../../app')

const nameOfNamespace = `my-namespace-test-${uuidv4()}`
let data = {
    "kind": "Namespace",
    "apiVersion": "v1",
    "metadata": {
        "name": `${nameOfNamespace}`,
        "labels": {
            "istio-injection": "enabled"
        }
    }
}

describe('Test K8S Namespace', () => {

    test('create new namespace', (done) => {
        request(app)
            .post('/namespace')
            .expect('Content-Type', /json/)
            .send(data)
            .expect(201)
            .end((err) => {
                if (err)
                    return done(err)
                return done()
            })
    })

    test('get existent namespace ', (done) => {
        request(app)
            .get(`/namespace/${nameOfNamespace}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.metadata.name).toBe(`${nameOfNamespace}`)
            })
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('try to get nonexistent namespace', (done) => {
        request(app)
            .get('/namespace/some-invalid-name')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('update namespace adding property annotations', (done) => {
        data.metadata.annotations = { newProperty: 'newValue' }
        request(app)
            .put(`/namespace/${nameOfNamespace}`)
            .expect('Content-Type', /json/)
            .send(data)
            .expect(200)
            .expect((res) => {
                expect(res.body.metadata.annotations).toHaveProperty('newProperty', 'newValue')
            })
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    test('delete namespace', (done) => {
        request(app)
            .delete(`/namespace/${nameOfNamespace}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})
