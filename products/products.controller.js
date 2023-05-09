const Product = require("../products/product.model")
const ProductImage = require("../productsImage/productImage.model")
require('dotenv').config()

class productsController {

  async createProduct (req, res) {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price + '$',
      quantity: req.body.quantity,
    }

    const product = new Product({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      quantity: productData.quantity,
    })

    await product.save()

    return res.status(200).json({ message: 'Product created successfully' })
  }

  async getAllProducts (req, res) {
    try {

      const allProducts = await Product.find({})

      return res.status(200).json(allProducts)
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
    }
  }

}

module.exports = new productsController()