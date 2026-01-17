module.exports = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  token_secret: process.env.TOKEN_SECRET,
  email_adress: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
  email_pwd: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
  hmac_secret: process.env.HMAC_VERIFICATION_CODE_SECRET,
  validStatus: ["present", "absent", "leave"],
  paymentMethods: ["bank_transfer", "cash", "check"],
};
