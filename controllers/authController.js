// Include authService and handle incoming HTTP requests for registration and login

const authService = require('../services/authService');
const { Authenticator } = require('otplib');

const register = async (req, res) => {
  const { email, password } = req.body;

  // Add reCaptcha validation here

  try {
    await authService.register(email, password);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
    console.error(error);
  }
};

const login = async (req, res) => {
  const { email, password, twoFactorToken } = req.body;

  try {
    const { token, user } = await authService.login(email, password);

    // Check if the user has 2FA enabled
    if (user.twoFactorSecret) {
        // Verify the 2FA token using the Authenticator library and the user's `twoFactorSecret`
        const isTwoFactorTokenValid = Authenticator.verify({
          token: twoFactorToken,
          secret: user.twoFactorSecret,
        });
  
        if (!isTwoFactorTokenValid) {
          res.status(401).send('Invalid two-factor authentication token');
          return;
        }
      }
  
      res.status(200).send({ token });
  } catch (error) {
    res.status(401).send('Invalid email or password');
    console.error(error);
  }
};

module.exports = {
  register,
  login,
};