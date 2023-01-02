const request = require('supertest')
const app = require('../src/app')

const createNamespace = (nameOfNamespace) => {
    const definitionOfNamespace = {
        "kind": "Namespace",
        "apiVersion": "v1",
        "metadata": { "name": `${nameOfNamespace}` }
    }
    request(app)
        .post('/namespace')
        .expect('Content-Type', /json/)
        .send(definitionOfNamespace)
        .expect(201)
        .end((err) => {
            if (err)
                console.error(err)
            return
        })
}

const deleteNamespace = (nameOfNamespace) => {
    request(app)
        .delete(`/namespace/${nameOfNamespace}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err) => {
            if (err)
                console.error(err)
            return
        })
}

module.exports = { createNamespace, deleteNamespace }