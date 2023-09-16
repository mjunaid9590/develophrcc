const jwt = require("jsonwebtoken")

 const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 675555555,
    expiresIn: process.env.JWT_EXPIRES_IN,

  });
  return token;
};

 const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

module.exports = {createJWT, verifyJWT}