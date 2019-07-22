const mongoose = require('mongoose')
const Product = require('../model/products')


exports.get_all_products = (req, res, next) => {
    Product.find()
    .exec()
    .then(products => {
        console.log('Load products success')
        res.status(200).json({
            message:'Get data success',
            success:true,
            data: products
        })
    })
    .catch(err => {
        console.log('Load products error: ' + err)
        res.status(404).json({
            message:'Get data fail: ' + err,
            success:false
        })
    })
}


exports.get_all_products_with_details = (req, res, next) => {
    Product.find()
    .exec()
    .then(products => {
        const responses = {
            count: products.length,
            products: products.map(p => {
                return {
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    request: {
                        type:'GET',
                        url: process.env.server + ':' + process.env.port + '/products/' + p._id
                    }
                }
            })
        }
        console.log('Load products success')
        res.status(200).json({
            message:'Get data success',
            success:true,
            data: responses
        })
    })
    .catch(err => {
        console.log('Load products error: ' + err)
        res.status(404).json({
            message:'Get data fail: ' + err,
            success:false
        })
    })
}


exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .exec()
    .then(product => {
        console.log('Found product by id: ' + product)
        if (product) {
            res.status(200).json(product)
        }
        else {
            res.status(404).json({
                success:false,
                message:'No product found with id: ' + id
            })
        }
    })
    .catch(err => {
        console.log('Find product error: ' + err)
        res.status(200).json({
            success:false,
            message:'Find product error: ' + err,
            code:404
        })
    })
}


exports.add_new_product = (req, res, next) => {
    const item = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    item.save().then(result => {
        console.log("insert product: " + result)
        res.status(201).json({
            success:true,
            message:'New Product has been inserted: ' + item._id,
            product:item
        })
    }).catch(err => {
        console.log('insert product error: ' + err)
        res.status(404).json({
            success:false,
            message:err.message
        })
    })

}


exports.delete_product_by_id = (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        console.log('Delete product success: ' + result)
        if (result.deletedCount > 0) {
            res.status(200).json({
                success:true,
                message:'Delete product success: ' + id
            })
        }else {
            res.status(200).json({
                success:false,
                message:'Delete product failed: No product assosiated with the id ' + id,
            })
        }
        
    })
    .catch(err => {
        console.log('Delete product error: ' + err.message)
        res.status(400).json({
            success:false,
            message:'Delete product failed: ' + id,
            error: err
        })
    })
}



exports.update_product_by_id = (req, res, next) => {
    const productId = req.params.productId
    const updateOps = {}
    for (const op of req.body) {
        updateOps[op.propName] = op.value
    }
    Product.update({_id: productId},{$set:updateOps})
    .exec()
    .then(result => {
        console.log('Num of affected rows: ' + result.n)
        console.log('Num of changed rows: ' + result.nModified)
        if (result.n > 0 && result.nModified > 0) {
            res.status(200).json({
                success: true,
                message: 'Update product success. Num of rows affected: ' + result.nModified
            })
        }
        else if (result.n > 0 && result.nModified == 0) {
            res.status(200).json({
                success: true,
                message: 'Command execute success but no data has changed after updating.'
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: 'No product were updated. Check parameters again'
            })
        }
    }).catch(err => {
        console.log('Delete product error: ' + err.message)
        res.status(500).json({
            success:false,
            message:'Update product failed: ' + err.message,
            error: err
        })
    })
}