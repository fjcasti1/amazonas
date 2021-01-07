import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAuth, isAdmin } from '../utils.js';

const userRouter = express.Router();

// @route     POST api/users/login
// @desc      Log in user
// @access    Public
userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordIsCorrect = bcrypt.compareSync(req.body.password, user.password);
      if (passwordIsCorrect) {
        return res.send({
          _id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({ message: 'Invalid Credentials' });
  }),
);

// @route     POST api/users/register
// @desc      Register user
// @access    Public
userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    const createdUser = await newUser.save();
    return res.send({
      _id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: createdUser.isSeller,
      token: generateToken(createdUser),
    });
  }),
);

// @route     GET api/users/:id
// @desc      Get user by Id
// @access    Private
userRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select([
      'name',
      'email',
      'isSeller',
      'isAdmin',
      'seller',
    ]);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

// @route     PUT api/users/profile
// @desc      Edit user profile
// @access    Private
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, email, password, sellerName, sellerLogo, sellerDescription } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: 'User Not Found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = bcrypt.hashSync(password, 8);
    }
    if (user.isSeller) {
      if (sellerName) user.seller.name = sellerName;
      if (sellerLogo) user.seller.logo = sellerLogo;
      if (sellerDescription) user.seller.description = sellerDescription;
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      token: generateToken(updatedUser),
    });
  }),
);

// @route     GET api/users
// @desc      Get all users
// @access    Private Admin
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    if (users) {
      res.send(users);
    } else {
      res.status(404).send({ message: 'Users Not Found' });
    }
  }),
);

// @route     DELETE api/users/:id
// @desc      Delete user by Id
// @access    Private Admin
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.send({ message: 'User deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

// @route     PUT api/users/:id
// @desc      Edit user by Id
// @access    Private Admin
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      const { name, email, isSeller, isAdmin } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      user.isSeller = isSeller;
      user.isAdmin = isAdmin;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isSeller: updatedUser.isSeller,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

export default userRouter;
