const { urlencoded } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testbloglist = require('../utils/testbloglist')

beforeEach(async () => {
    await Blog.deleteMany({})
})

describe('bloglist GET tests', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blog identifier is id insted of _id', async () => {
        const createdBlog = await Blog.create({
            title: 'miikanblogi',
            author: 'miika1233334'
        })
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('blogs POST tests', () => {
    test('POST request adds a blog to the list', async () => {
        const initialblogs = await api.get('/api/blogs')
        console.log(initialblogs.body.length)

        const blogPost = {
            title: 'New blogpost',
            author: 'Miika H.',
            url: '/joke',
            likes: '0'
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'enni123')
            .send(blogPost)
            .expect(201)

        const response = await api.get('/api/blogs')
        
        expect(response.body.length).toBe(initialblogs.body.length + 1)

    })

    test('likes defaults to 0', async () => {
        const blogPost = {
            title: '0 likes post',
            url: '/0likespost',
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'enni123')
            .send(blogPost)
            .expect(201)

        const response = await api.get('/api/blogs')

        expect(response.body[response.body.length - 1].likes).toEqual(0) 

    })

    test('responds with 400 if no title or url', async() => {
        const blogPost = {
            author: 'dummy'
        }
        await api
            .post('/api/blogs')
            .set('Authorization', 'enni123')
            .send(blogPost)
            .expect(400)
    })

})


afterAll(async () => {
    await mongoose.connection.close()
})