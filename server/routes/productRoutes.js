import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth, isSellerOrAdmin } from '../utils.js';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

// Access to env variables
dotenv.config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new aws.S3();
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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
    const { name, category, seller, min, max, rating, order } = req.query;

    const nameFilter = name && { name: { $regex: name, $options: 'i' } };

    const priceFilter = min && max && { price: { $gte: min, $lte: max } };

    const ratingFilter = rating && { rating: { $gte: rating } };

    const categoryFilter = category && { category };

    const sellerFilter = seller && { seller };

    const sortOrder =
      order === 'newest'
        ? { _id: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'rating'
        ? { rating: -1 }
        : { _id: -1 }; // Sorted by newwet arrivals by default

    const products = await Product.find({
      ...nameFilter,
      ...categoryFilter,
      ...sellerFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort(sortOrder);

    res.send(products);
  }),
);

// @route     GET api/products/categories
// @desc      Get all product categories
// @access    Public
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    if (!categories) return res.status(404).send({ message: 'Categories Not Found' });
    res.send(categories);
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
      if (name) product.name = name;
      if (price) product.price = price;
      if (image) product.image = image;
      if (category) product.category = category;
      if (brand) product.brand = brand;
      if (countInStock) product.countInStock = countInStock;
      if (description) product.description = description;
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
  isSellerOrAdmin,
  upload.single('image'),
  (req, res) => {
    res.send(`${req.file.location}`);
  },
);

// @route     DELETE api/products/:id
// @desc      Delete product by Id
// @access    Private Admin
productRouter.delete(
  '/:id',
  isAuth,
  isSellerOrAdmin,
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

// @route     POST api/products/:id/reviews
// @desc      Create a product review
// @access    Private
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).send({ message: 'Product Not Found' });
    } else {
      if (product.reviews.find((x) => x.userName === req.user.name)) {
        return res.status(400).send({ message: 'You already submitted a review' });
      }
      const review = { rating, comment, userName: req.user.name };
      product.reviews.push(review);
      product.numReviews += 1;
      product.rating =
        product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
        product.reviews.length;

      await product.save();

      const seller = await User.findById(product.seller);
      const { rating: sellerRating, numReviews: sellerNumReviews } = seller.seller;
      seller.seller.rating =
        (sellerRating * sellerNumReviews + Number(rating)) / (sellerNumReviews + 1);
      seller.seller.numReviews += 1;

      await seller.save();

      res.status(201).send({ message: 'Review Updated', review: review });
    }
  }),
);

export default productRouter;
