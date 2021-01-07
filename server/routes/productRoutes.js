import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const productRouter = express.Router();

// @route     GET api/products
// @desc      Get all products
// @access    Public
productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const name = req.query.name;
    const seller = req.query.seller;
    const nameFilter = name
      ? {
          name: { $regex: name, $options: 'i' },
        }
      : {};
    const sellerFilter = seller ? { seller } : {};
    const products = await Product.find({ ...nameFilter, ...sellerFilter }).populate(
      'seller',
      'seller.name seller.logo',
    );
    res.json(products);
  }),
);

// @route     GET api/products/:id
// @desc      Get product by Id
// @access    Public
productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews',
    );
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
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Sample name' + Date.now(),
      seller: req.user._id,
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
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const { name, price, image, category, brand, countInStock, description } = req.body;

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

// @route     POST api/products/uploadimage
// @desc      Upload product image
// @access    Private Admin
productRouter.post(
  '/uploadimage',
  isAuth,
  isAdmin,
  upload.single('image'),
  (req, res) => {
    res.send(`/${req.file.path}`);
  },
);

// @route     DELETE api/products/:id
// @desc      Delete product by Id
// @access    Private Admin
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }),
);

export default productRouter;
