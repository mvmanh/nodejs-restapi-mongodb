const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoute = require('./api/route/products')
const orderRoute = require('./api/route/orders')
const userRoute = require('./api/route/users')

const app = express()

mongoose.connect('mongodb://localhost/nodejsApi',{ useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use((req, res, next) => {
    res.header('response-header-demo-field','demo-value')
    next()
})

app.use('/products', productRoute)
app.use('/orders', orderRoute)
app.use('/users', userRoute)

app.use('/', (req, res) => {
    res.status(200).json({
        success:true,
        message:'Welcome to node js rest api sample project',
        reference:'https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q',
        endpoints: {
            users: {
                methods:['GET'],
                path: ['/users/login', '/users/signUp'],
                jwt_authorization: false
            },
            products: {
                methods:['GET','POST','PUT','DELETE'],
                path:['/products'],
                jwt_authorization: true
            },
            orders: {
                methods:['GET','POST','PUT','DELETE'],
                path:['/orders'],
                jwt_authorization: true
            }
        }
    })
})

app.use((req, res, next) => {
    const error = new Error("Api endpoint is not supported or has access limited")
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        success:false,
        error: error.message
    })
})

module.exports = app