import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = 'backend';

export const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
