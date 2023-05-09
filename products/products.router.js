const router = require('express').Router()
const controller = require('./products.controller')

router.post('/create-product', controller.createProduct)

router.get('/all-products', controller.getAllProducts)

module.exports = router