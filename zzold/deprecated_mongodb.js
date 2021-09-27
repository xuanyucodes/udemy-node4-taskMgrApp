// CRUD create read update delete

const {MongoClient, ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017' // connect to the mongodb server URL
const databaseName = 'task-manager' // database name

MongoClient.connect(connectionURL, 
    { useNewUrlParser: true }, // second arg is an options object. compulsory to add useNewUrlParser: true because of some deprecation thingy
    (error, client) => { // third arg is callback fn that will be called when connected to db
        if (error) {
            return console.log('Unable to connect to database!')
        }

        console.log('Connected correctly!')
        const db = client.db(databaseName) // by just running this code, you CREATE and get a reference to this new mongodb
        
        // C - CREATE
        // db.collection('tasks').insertMany([
        //     {description: 'Clean the house', completed: true},
        //     {description: 'Renew inspection', completed: false},
        //     {description: 'Pot plants', completed: false},
        // ], (error, result) => {
        //     if (error) {return console.log('Unable to insert tasks')}
        //      console.log(result)
        // })

        // READ
        // db.collection('users').findOne({age: 27}, (error, user) => {
        //     if (error) {return console.log('Unable to fetch')}
        //     console.log(user)
        // })

        // db.collection('users').find({age: 27}).toArray((error, users) => {
        //     console.log(users)
        // })

        // UPDATE
        // db.collection('users').updateOne({ // first arg is the filter to find it
        //     _id: new ObjectId("614f025b215483cca053b046")
        // }, { // second arg is the update, which has its own jargon
        //     $inc: { age: 3}
        // })
        // .then((result) => { console.log(result) })
        // .catch((error) => { console.log(error) })

        // db.collection('tasks').updateMany({
        //     completed: false
        // }, {
        //     $set: {completed: true}
        // })
        // .then((result) => { console.log(result) })
        // .catch((error) => { console.log(error) })

        // DELETE
        // db.collection('tasks').deleteOne({description: {$regex:'Clean*'}})
        // .then(result => console.log(result))
        // .catch(error => console.log(error))

        // db.collection('users').deleteMany({age:27})
        // .then(result => console.log(result))
        // .catch(error => console.log(error))
    }
)