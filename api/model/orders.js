const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Order', orderSchema)