const axios = require('axios');


const verifyRecaptchaV3 = async (recaptchaToken) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY_V3;
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
  
const verifyRecaptchaV2 = async (recaptchaToken) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY_V2;
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

module.exports = {
    verifyRecaptchaV2,
    verifyRecaptchaV3,
}