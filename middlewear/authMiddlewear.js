const {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} = require("../errors/customerror");
const { verifyJWT } = require("../middlewear/token");

 const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('authentication invalid');

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === '64b2c07ccac2efc972ab0eca';
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

 const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles, req.user.role)
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

 const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
  next();
};

module.exports = {authenticateUser, authorizePermissions, checkForTestUser}