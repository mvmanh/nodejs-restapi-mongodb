const express = require('express')
const jwtAuth = require('../middleware/auth')
const router = express.Router()
const ProductsController = require('../controllers/products')

router.get('/', ProductsController.get_all_products)

router.get('/details', jwtAuth, ProductsController.get_all_products_with_details)

router.get('/:productId', ProductsController.get_product_by_id)

router.post('/', jwtAuth, ProductsController.add_new_product)

router.delete('/:productId', jwtAuth, ProductsController.delete_product_by_id)

router.put('/:productId', jwtAuth, ProductsController.update_product_by_id)

module.exports = router