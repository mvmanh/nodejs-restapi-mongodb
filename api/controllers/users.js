const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../model/users')


exports.user_signup = (req, res, next) => {
    
    if (!req.body.password || req.body.password == '') {
        res.status(400).json({
            success: false,
            message: 'Please specify a valid password'
        })  
        return;
    }

    if (!req.body.email || req.body.email == '') {
        res.status(400).json({
            success: false,
            message: 'Please specify a valid email address'
        })  
        return;
    }


    User.find({email:req.body.email})
    .exec()
    .then(result => {
        if (result.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Email address has already exists'
            })
        }else {
            bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Can not hash the provided password'
                    })
                }
                else {
                    const newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: encrypted
                    })
                    newUser.save()
                    .then(result => {
                        res.status(201).json({
                            success: true,
                            message: 'Create new account success',
                            data: newUser
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            success: false,
                            message: 'Error createing new account: ' + err.message
                        })
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
    return;
}



exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(result => {
        if (result.length == 0) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: 'Invalid email address or password'
            })    
        }
        user = result[0]

        bcrypt.compare(req.body.password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    code: 500,
                    message: err.message
                })
            }else if (!match){
                return res.status(401).json({
                    success: false,
                    code: 401,
                    message: 'Password does not match'
                })
            }else {
                const token = jwt.sign({
                    id: user._id,   
                    email: user.email
                }, process.env.jwt_secret, 
                {
                    expiresIn: process.env.jwt_duration
                })
                return res.status(200).json({
                    success:true,
                    message:'Login successful',
                    token: token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            code: 500,
            message: err.message
        })
    })
}