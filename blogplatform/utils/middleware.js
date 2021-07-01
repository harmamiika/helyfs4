const jwt = require('jsonwebtoken')
const { request, response } = require('express')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    console.log(authorization, 'auth')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (request, response, next) => {
    console.log(request.token, 'req token')
    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    } else {
        console.log('no user token')
    }


    next()
}


module.exports = { tokenExtractor, userExtractor }