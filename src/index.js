const express = require('express')
require('./db/mongoose') // no need to assign, we just running the file to ensure db connections
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// middleware - authentication. need to include BEFORE the app.use() portions
// commented out cos moved the middleware into the routers themselves but still follow the path of path -> middleware -> fn  
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// middleware - maintenance mode request (fun exercise), so when you need to pause your website, can activate this
// app.use((req, res, next) => {
//     res.status(503).send('Maintenance mode. Site is currently down. Check back soon!')
// })

app.use(express.json()) // automatically parses incoming JSON str into JSON objs
app.use(userRouter) // register the User router
app.use(taskRouter)

app.listen(port, () => console.log(`Server is up on port ${port}.`))