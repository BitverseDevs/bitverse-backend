// Include authService and handle incoming HTTP requests for registration and login

const authService = require('../services/authService');
const { authenticator: Authenticator } = require('otplib');

const register = async (req, res) => {
  const { email, password } = req.body;

  //TODO: Add reCaptcha validation here

  try {
    await authService.register(email, password);
    res.status(201).send('User registered successfully');
  } catch (error) {
    if(error.code === 11000){
      // Duplicate Email Error
      res.status(409).send('Email already in use');
    } else {
      // General Server Error
      res.status(500).send('Error registering user');
    }
    console.error(error);
  }
};

const login = async (req, res) => {
  const { email, password, twoFactorToken, recaptchaToken } = req.body;

  try {
    const { token, user } = await authService.login(email, password, recaptchaToken);

    // Check if the user has 2FA enabled
    if (user.twoFactorSecret && user.isTwoFactorEnabled) {
        // Verify the 2FA token using the Authenticator library and the user's `twoFactorSecret`
        const isTwoFactorTokenValid = Authenticator.verify({
          token: twoFactorToken,
          secret: user.twoFactorSecret,
        });
  
        if (!isTwoFactorTokenValid) {
          res.status(401).send('Invalid/Missing two-factor authentication token');
          return;
        }
      }
  
      res.status(200).send({ token });
  } catch (error) {
    res.status(401).send('Invalid email or password');
    console.error(error);
  }
};

const verifyRecaptchaV3 = async (req, res) => {
  const recaptchaToken = req.body.recaptchaToken;

  try {
    await authService.verifyRecaptchaV3(recaptchaToken);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(401).send({ success: false, message: error.message });
  }
};

const verifyRecaptchaV2 = async (req, res) => {
  const recaptchaToken = req.body.recaptchaToken;

  try {
    await authService.verifyRecaptchaV2(recaptchaToken);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(401).send({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  verifyRecaptchaV3,
  verifyRecaptchaV2,
};