const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')



describe('Users post tests', () => {

    beforeEach( async () => {
        await User.deleteMany({})
    })

    test('system prevents creating users with too short username', async () => {
        const shortUsernameDude = {
            username: 'mr',
            name: 'mr man',
            password: 'bigboy'
        }

        await api
            .post('/api/users')
            .send(shortUsernameDude)
            .expect(400)
    })

    test('unique username is required for registering', async () => {
        const nonUniqueUsernameMan = {
            username: 'miika123333',
            password: 'miika321',
            url: '/miika123'
        }

        await api
            .post('/api/users')
            .send(nonUniqueUsernameMan)
            .expect(201)

        const secondRequest = await api
            .post('/api/users')
            .send(nonUniqueUsernameMan)
            .expect(400)

        expect(secondRequest.body.error)
        
    })

})


afterAll(async () => {
    await mongoose.connection.close()
})