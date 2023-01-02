const request = require('supertest')
const { v4: uuidv4 } = require('uuid');

const app = require('../../../app')
const common = require('../../../../test/common')

const nameOfNamespace = `namespace-test-deployment-${uuidv4()}`
const nameOfDeployment = 'my-deployment'

let data = {
    "namespace": `${nameOfNamespace}`,
    "deployment": {
        "kind": "Deployment",
        "apiVersion": "apps/v1",
        "metadata": { "name": `${nameOfDeployment}`, "namespace": `${nameOfNamespace}` },
        "spec": {
            "replicas": 1,
            "selector": { "matchLabels": { "app": "webapp-color" } },
            "template": {
                "metadata": { "labels": { "app": "webapp-color" } },
                "spec": {
                    "containers": [
                        {
                            "name": "webapp-color",
                            "image": "leviditomazzo/web-color-a:v0.0.1",
                            "ports": [{ "containerPort": 80, "protocol": "TCP" }]
                        }
                    ]
                }
            }
        }
    }
}

describe('Test K8S Deployment', () => {

    beforeAll(() => common.createNamespace(nameOfNamespace))
    afterAll(() => common.deleteNamespace(nameOfNamespace))

    test('create new deployment', (done) => {
        request(app)
            .post('/deployment')
            .expect('Content-Type', /json/)
            .send(data)
            .expect(201)
            .end((err) => {
                if (err)
                    return done(err)
                return done()
            })
    })

    test('get existent deployment ', (done) => {
        request(app)
            .get(`/deployment/${nameOfNamespace}/${nameOfDeployment}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
                expect(res.body.metadata.name).toBe(`${nameOfDeployment}`)
            })
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('try to create deployment with invalid arguments', (done) => {
        request(app)
            .post('/deployment')
            .send({})
            .expect(400)
            .end((err) => {
                if (err)
                    return done(err)
                return done()
            })
    })

    test('try to get nonexistent deployment', (done) => {
        request(app)
            .get(`/deployment/${nameOfNamespace}/some-invalid-name`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err) => {
                if (err) return done(err)
                return done()
            })
    })

    test('update deployment adding property annotations', (done) => {
        data.deployment.metadata.annotations = { newProperty: 'newValue' }
        request(app)
            .put(`/deployment/${nameOfDeployment}`)
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

    test('delete deployment', (done) => {
        request(app)
            .delete('/deployment')
            .expect('Content-Type', /json/)
            .send({
                namespace: nameOfNamespace,
                name: nameOfDeployment
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})
