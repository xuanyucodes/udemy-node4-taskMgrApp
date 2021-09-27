const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// create one user, aka sign up
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) // self-created fn that finds user by email, then verify pw, and return user or not
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// logout - has auth cos need to be authenticated to be logged out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token // dont want current session token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 

// logout ALL sessions (remove all tokens)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}) 

// read all users (can see everyone) - deprecated
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// read all users (can see everyone) - deprecated
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch(e) {
//         res.status(500).send(e)
//     }
// })

// read one user
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id // gets access to the :id
    try {
        const user = await User.findById(_id) // mongoose helps to convert into objectid
        if (!user) { return res.status(404).send() }
        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})

// update a user
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // see which properties user trying to update
    const allowedUpdates = ['name', 'email', 'password', 'age'] // need this because if someone tries to update an undefined property or _id, will return 200 and no change, but we should handle it anyway
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)) // is it valid operation? every() runs once for each element, must be ALL true then return true, if one false return false.
    if (!isValidOperation) { return res.status(400).send({error: 'Invalid updates!'})}

    try {
        // the below first line is replaced by the next 3 lines
        // new: true returns the new user rather than the before-edit version. runValidators causes your validate() to check again
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        const user = await User.findById(req.params.id)
        if (!user) { res.status(404).send() }
        
        updates.forEach(update => user[update] = req.body[update] ) // manually update
        await user.save()
        
        res.send(user)
    } catch(e) { res.status(400).send(e) }
})

// delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {return res.status(404).send()}
        res.send(user)
    } catch(e) { res.status(500).send(e)}
})

module.exports = router