require('../src/db/mongoose')
const User = require('../src/models/user')

// notice how no need $set stuff like in MongoDB, as Mongoose helps us
// User.findByIdAndUpdate('614f695e7a5f3bc08bc78784', { age: 1 }).then(user => {
//     console.log(user)
//     return User.countDocuments({age: 1})
// }).then(result => {
//     console.log(result)
// }).catch(e => console.log(e))

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('614f695e7a5f3bc08bc78784', 999)
    .then(count => console.log(count))
    .catch(e => console.log(e))