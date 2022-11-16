const jwt = require('jsonwebtoken' );
const User = require('../models/user' );
const accessTokenSecret = 'mysupercoolsecret' ;
//const accessToken = process.env.MAIN_TOKEN;
const authenticatePers  = async (email, password) => {
   const user = await User.authenticateUser (email, password);
   if (user === null) {
       return user;
   }
   const users = await User.findUserByEmail (email);
   console.log('Users', users);
   const accessToken = jwt.sign({ ...users[0], claims: ['user'] }, accessTokenSecret );
   return accessToken;
  
}
module.exports = {
   authenticatePers
};