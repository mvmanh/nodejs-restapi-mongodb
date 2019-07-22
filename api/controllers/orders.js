const mongoose = require('mongoose')
const Order = require('../model/orders')
const Product = require('../model/products')

// return all orders from database
exports.get_all_orders = (req, res, next) => {
    Order.find()
    .exec()
    .then(orders => {
        const resonse = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    quantity: order.quantity,
                    product: order.product,
                    created: order.created,
                    request: {
                        type:'GET',
                        url:process.env.server + ':' + process.env.port + '/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json({
            success: true,
            data: resonse
        })
    })
    .catch(err => {
        // malformed request
        res.status(400).json({
            success:false,
            message:err.message
        })
    })
}


exports.get_all_orders_with_details = (req, res, next) => {
    Order.find()
    .select('_id product quantity') // ignored 'created' field
    .populate('product','_id name price') // get data from foreign key (3 fields only)
    //.populate('product') // get data from foreign key
    .exec()
    .then(orders => {
        const resonse = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    quantity: order.quantity,
                    product: order.product,
                    created: order.created,
                    request: {
                        type:'GET',
                        url: process.env.server + ':' + process.env.port + '/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json({
            success: true,
            data: resonse
        })
    })
    .catch(err => {
        // malformed request
        res.status(400).json({
            success:false,
            message:err.message
        })
    })
}


exports.get_order_by_id = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
    .exec()
    .then(order => {
        if (order) {
            res.status(200).json({
                success: true,
                data: {
                    order: order,
                    request: {
                        type: 'GET',
                        url: process.env.server + ':' + process.env.port + '/orders/' + order._id
                    }
                }
            })
        }else {
            res.status(404).json({
                success: false,
                message:'No order found with id ' + orderId 
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
}


exports.create_new_order = (req, res, next) => {

    const pId = req.body.product
    Product.findById(pId)
    .then(p => {
        if (!p) {
            return res.status(404).json({
                success: false,
                message: 'No product found with this id: ' + pId
            })
        }
        const newOrder = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.product
        })
        return newOrder.save()
    })
    .then(product => {
        console.log('Insert order success: ' + JSON.stringify(product))
        res.status(201).json({
            success: true,
            message: 'Insert new order success: ',
            order:product,
            request: {
                type:'GET',
                url: process.env.server + ':' + process.env.port + '/orders/' + product._id
            }
        })
    })
    .catch(err => {
        console.log('Insert order error: ' + JSON.stringify(err))
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
}



exports.delete_order_by_id = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({
                success:true,
                message:'Deleted ' + result.deletedCount + " item(s)"
            })
        }else {
            res.status(404).json({
                success:false,
                message:'No order found with given id'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
}