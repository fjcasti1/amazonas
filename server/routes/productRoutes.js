import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();

// @route     GET api/products
// @desc      Get all products
// @access    Public
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  }),
);

// @route     GET api/products/:id
// @desc      Get product by Id
// @access    Public
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }),
);

// @route     POST api/products
// @desc      Create a new product
// @access    Private Admin
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Sample name' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'Sample category',
      brand: 'Sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.send({ message: 'Product created', product: createdProduct });
  }),
);

// @route     PUT api/products/:id
// @desc      Update a product
// @access    Private Admin
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const {
      name,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
    } = req.body;

    if (!product) {
      res.status(404).send({ message: 'Product Not Found' });
    } else {
      product.name = name;
      product.price = price;
      product.image = image;
      product.category = category;
      product.brand = brand;
      product.countInStock = countInStock;
      product.description = description;
    }
    const updatedProduct = await product.save();
    res.send({ message: 'Product Updated', product: updatedProduct });
  }),
);

export default productRouter;
