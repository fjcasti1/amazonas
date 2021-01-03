import jwt from 'jsonwebtoken';

export const generateToken = ({ _id, name, email, isAdmin }) => {
  return jwt.sign(
    {
      _id,
      name,
      email,
      isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30m',
    },
  );
};

export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1]; // Bearer XXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};
