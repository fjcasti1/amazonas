import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

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
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({ message: 'Invalic Credentials' });
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
    const user = await User.findById(userId).select(['name', 'email']);
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
    const user = await User.findById(userId);
    if (user) {
      const { name, email, password } = req.body;
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        user.password = bcrypt.hashSync(password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }),
);

export default userRouter;
