const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const { resource } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({}).populate('user', { username: 1, name: 1 })
        .then(blogs => {
            response.json(blogs)
        })
})

// token luetaan headerista - bearer skeema??
// const getTokenFrom = request => {
//     //eristää tokenin headerista authorization
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7)
//     }
//     return null
// }

blogsRouter.post('/', async (request, response) => {
    //blog checks
    const blog = new Blog(request.body)
    if (!blog.title || !blog.url) {
        return response.status(400).send('title and url are required')
    }

    console.log(request.token, ' yoyoyoyoyoyo ')
    console.log(request.user)

    const user = request.user
    blog.user = user

    const savedBlog = await blog.save()
    console.log(savedBlog, 'savedblog')
    //pitää lisätä myös userin notesiin
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    //käyttäjän tunnistus

    console.log(request.user, 'request user')

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    console.log(user, 'asdasdauser')
    console.log(blog, 'bloggg')

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'you need to be signed in as the creator to delete this blog' })
    }

    await blog.remove()
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== request.params.id.toString())
    await user.save()

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body
    console.log(request.params.id, 'id')
    console.log(blog, 'blog')



    const filter = { _id: blog.id }
    const update = { likes: blog.likes }

    const mongoresponse = await Blog.findOneAndUpdate(filter, update, { new: true })

    // THIS DID NOT WORK FOR SOME REASON
    // const mongoresponse = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).catch(e => console.log(e, 'mongoose'))


    console.log(mongoresponse, 'mongo res')
    response.json(mongoresponse.toJSON())
})

module.exports = blogsRouter