const { verifyRecaptchaV2 } = require('../helpers/captcha');



const recaptchaMiddleware = async (req, res, next) => {
    try {
      const recaptchaToken = req.body.recaptchaToken;
      if (!recaptchaToken) {
        throw new Error('reCAPTCHA token is required');
      }
  
      await verifyRecaptchaV2(recaptchaToken);
      next();
    } catch (error) {
      res.status(400).send(error.message);
    }
};


module.exports = recaptchaMiddleware;