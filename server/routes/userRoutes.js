import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

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

export default userRouter;
