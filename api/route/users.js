const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken')
const UsersController = require('../controllers/users')

route.post('/signUp', UsersController.user_signup)

route.post('/login', UsersController.user_login)

module.exports = route