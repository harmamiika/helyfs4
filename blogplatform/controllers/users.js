const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


// huom /:id get delete yms.

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1, likes: 1 })

    // res.json(users) <- mikä erO???
    res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if (body.password.length < 3 || body.username.length < 3) {
        return res.status(400).send('password or username too short')
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    console.log(savedUser)
    res.status(201).json(savedUser)
})


module.exports = usersRouter