import express from 'express';
import data from '../data.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const databaseRouter = express.Router();

// @route     GET api/database/users/seed
// @desc      Seed users data to database
// @access    Public
databaseRouter.get(
  '/users/seed',
  expressAsyncHandler(async (req, res) => {
    const createUsers = await User.insertMany(data.users);
    res.json(createUsers);
  }),
);

// @route     DELETE api/database/users/clear
// @desc      Clear users data from database
// @access    Public
databaseRouter.delete(
  '/users/clear',
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    res.send({ msg: 'users removed' });
  }),
);

// @route     GET api/database/products/seed
// @desc      Seed products data to database
// @access    Public
databaseRouter.get(
  '/products/seed',
  expressAsyncHandler(async (req, res) => {
    const createProducts = await Product.insertMany(data.products);
    res.json(createProducts);
  }),
);

// @route     DELETE api/database/products/clear
// @desc      Clear products data from database
// @access    Public
databaseRouter.delete(
  '/products/clear',
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    res.send({ msg: 'products removed' });
  }),
);

export default databaseRouter;
