const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')

loginRouter.post('/', async (req, res) => {
    const { body } = req

    console.log(body)

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    // tämän voisi siis myös throwaa error handleriin ft statuskoodi
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }


    // token systeemi - jwt - JSON webtoken library
    const userForToken = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)


    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter