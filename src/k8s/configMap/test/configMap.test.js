const request = require('supertest')
const { v4: uuidv4 } = require('uuid');

const app = require('../../../app')
const common = require('../../../../test/common')

const nameOfNamespace = `namespace-test-configmap-${uuidv4()}`
const nameOfConfigMap = `my-configmap-${uuidv4()}`

let data = {
    "apiVersion": "v1",
    "kind": "ConfigMap",
    "metadata": { "name": `${nameOfConfigMap}`, "namespace": `${nameOfNamespace}` },
    "data": {
        "key": "value"
    }
}

describe('Test K8S ConfigMap', () => {

    beforeAll(() => common.createNamespace(nameOfNamespace))
    afterAll(() => common.deleteNamespace(nameOfNamespace))

    test('create new configMap', (done) => {
        request(app)
            .post('/configMap')
            .expect('Content-Type', /json/)
            .send(data)
            .expect(201)
            .end((err) => {
                if (err)
                    return done(err)
                return done()
            })
    })

    test('get existent configMap ', (done) => {
        request(app)
            .get(`/configMap/${nameOfNamespace}/${nameOfConfigMap}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.metadata.name).toBe(`${nameOfConfigMap}`)
            })
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('try to get nonexistent nameOfConfigMap', (done) => {
        request(app)
            .get(`/configMap/${nameOfNamespace}/some-invalid-name`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('update nameOfConfigMap adding property annotations', (done) => {
        data.metadata.annotations = { newProperty: 'newValue' }
        request(app)
            .put(`/configMap`)
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

    test('delete configMap', (done) => {
        request(app)
            .delete('/configMap')
            .expect('Content-Type', /json/)
            .send({
                namespace: nameOfNamespace,
                name: nameOfConfigMap
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})
