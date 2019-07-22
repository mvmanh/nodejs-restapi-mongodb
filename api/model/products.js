const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type:String,
        required:true,
        minlength: 3,
        maxlength: 128,
        unique: true
    },
    price: {
        type: Number,
        required:true
    }
})

module.exports = mongoose.model('Product', productSchema)