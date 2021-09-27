const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({ // first arg = str name of model, second arg = fields you want and their customisation
    name: { // also supports booleans, dates, arrays, binary, ObjectId etc.
        type: String,
        required: true, // field is compulsory
        trim: true
     }, 
    age: { 
        type: Number,
        default: 0,
        validate(value) { if (value < 0) {throw new Error('Age must be a positive number')}}
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) { if (!validator.isEmail(value)) {throw new Error('Email is invalid')}}
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) { if (value.toLowerCase().includes('password')) {throw new Error('Password cannot contain "password"')} }
    },
    tokens: [{ // each user can have multiple tokens. store an array of objs, each w token property
        token: {
            type: String,
            required: true 
        }
    }]
}, {
    timestamps: true,
})

// first arg = name of virtual field, second arg = configure the field
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // field of User that matches foreignField
    foreignField: 'owner' // field name on the other entity
})  

userSchema.methods.toJSON = function () { // standard fn cos we need "this"
    const user = this
    const userObject = user.toObject() // returns an obj with all the metadata and methods removed like .save() or .toObject() etc.
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'mysecretsignature')
    user.tokens = user.tokens.concat({token: token}) // an array appending another token
    await user.save()
    return token
}

// statics are for the Model uppercase User (class), while methods are for the instances lowercase user
userSchema.statics.findByCredentials = async (email, password) => { // set up a new value on userSchema.statics, so we can have access to it later
    const user = await User.findOne({email})
    if (!user) { throw new Error('Unable to login.')} // throw an error to catch()
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { throw new Error('Unable to login.') }
    
    return user
}

// before saving, hash plain text pw
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) { // isModified() checks if a field was changed; even if change to same value it is counted as changed
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// deletes a User's tasks if user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User