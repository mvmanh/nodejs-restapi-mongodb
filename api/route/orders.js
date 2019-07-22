const express = require('express')
const jwtAuth = require('../middleware/auth')
const router = express.Router()

const OrdersController = require('../controllers/orders')

// find all orders
router.get('/', jwtAuth, OrdersController.get_all_orders)

// find all orders with all product informations
router.get('/details', jwtAuth, OrdersController.get_all_orders_with_details)

router.get('/:orderId', jwtAuth, OrdersController.get_order_by_id)

router.post('/', jwtAuth, OrdersController.create_new_order)

router.delete('/:orderId', jwtAuth, OrdersController.delete_order_by_id)


module.exports = router