const jwt = require('jsonwebtoken') // to validate token
const User = require('../models/user') // then find that user

// check if have authentication token, and return the user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') // access request's header with a key called 'Authorization'
        const decoded = jwt.verify(token, 'mysecretsignature')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) // find user by id, and ensure that he still has an active token
        
        if(!user) {throw new Error()} // to trigger .catch()
        
        req.token = token
        req.user = user // store user info in Request. since we alr find, later in routes can just access this, dont need find again.
        next()
    } catch(e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth