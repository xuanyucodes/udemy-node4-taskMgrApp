require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.deleteOne({_id: '614f85e51780d8983d2b43be'})
//     .then(task => {
//         console.log(task)
//         return Task.count({completed:false})
//     }).then(result => console.log(result))
//     .catch(e => console.log(e))

const deleteTaskAndCount = async (id) => {
    const deletion = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('61502eb5735c1bc3bfd143cc')
    .then(count => console.log(count))
    .catch(e => console.log(e))