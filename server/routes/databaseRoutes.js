import express from 'express';
import data from '../data.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';

const databaseRouter = express.Router();

// @route     POST api/database/users/seed
// @desc      Seed users data to database
// @access    Public
databaseRouter.get(
  '/users/seed',
  expressAsyncHandler(async (req, res) => {
    const createUsers = await User.insertMany(data.users);
    res.json(createUsers);
  }),
);

// @route     POST api/database/users/clear
// @desc      Clear users data from database
// @access    Public
databaseRouter.get(
  '/users/clear',
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    res.send({ msg: 'users removed' });
  }),
);

export default databaseRouter;
