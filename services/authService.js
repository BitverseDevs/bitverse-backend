// Include required libraries and files here, e.g., bcrypt, jsonwebtoken, User model, Google Authenticator library, etc.

// Define functions for registration, login, and token verification here

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { authenticator: Authenticator } = require('otplib');
const User = require('../models/User');

const verifyRecaptcha = async (recaptchaToken) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);
    const { success } = response.data;

    if (!success) {
      throw new Error('Invalid reCAPTCHA token');
    }
  } catch (error) {
    throw new Error('Error verifying reCAPTCHA token');
  }
};

const register = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  // const twoFactorSecret = generate2FASecret();
  const newUser = new User({ email, password: hashedPassword, isTwoFactorEnabled: false });
  return await newUser.save();
};

const login = async (email, password, twoFactorToken, recaptchaToken) => {
  if(recaptchaToken){ // TO DO: We can modify this statement to be optionally switchable
    await verifyRecaptcha(recaptchaToken);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  };

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  };

  if (user.twoFactorSecret && twoFactorToken) {
    const isTokenValid = verify2FAToken(user, twoFactorToken);
    if (!isTokenValid) {
      throw new Error('Invalid 2FA token');
    }
  };

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token, user };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const generate2FASecret = () => {
    return Authenticator.generateSecret();
};

const verify2FAToken = (user, token) => {
    return Authenticator.verify({ token, secret: user.twoFactorSecret });
};

module.exports = {
  register,
  login,
  verifyToken,
  generate2FASecret,
  verify2FAToken,
  verifyRecaptcha,
};