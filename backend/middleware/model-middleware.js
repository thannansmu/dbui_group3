const User = require('../models/user');
const Algorithm = require('../models/algorithm')
const createModelsMiddleware = async (req, res, next) => {
   req.models = {
      user: User,
      algorithm: Algorithm
  }
  next();
}
module.exports = {
  createModelsMiddleware
}