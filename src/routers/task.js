const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// create one task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({...req.body, owner: req.user._id})
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) { res.status(400).send(e) }
})

// read all tasks owned by user
router.get('/tasks', auth, async (req, res) => {
    try {
        // correct code-> const tasks = await Task.find({owner: req.user._id}) // correct code, but lets use alternative
        await req.user.populate('tasks') // alternative approach
        res.send(req.user.tasks)
    } catch (e) { res.status(500).send(e) }
})

// read all tasks (deprecated)
// router.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (e) { res.status(500).send(e) }
// })

// read one task owned by user
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {return res.status(404).send()}
        res.send(task)
    } catch(e) { res.status(500).send(e) }
})

// read one task (deprecated)
// router.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const task = await Task.findById(_id)
//         if (!task) {return res.status(404).send()}
//         res.send(task)
//     } catch(e) { res.status(500).send(e) }
// })

// update a task owned by user
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) { res.status(400).send({error: 'Invalid update!'}) }
    
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) { return res.status(404).send() }
        
        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) { res.status(400).send(e) }
})

// update a task (deprecated)
// router.patch('/tasks/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update))
//     if (!isValidOperation) { res.status(400).send({error: 'Invalid update!'}) }
    
//     try {
//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
//         const task = await Task.findById(req.params.id)
//         if (!task) { return res.status(404).send() }
        
//         updates.forEach(update => task[update] = req.body[update])
//         await task.save()

//         res.send(task)
//     } catch(e) { res.status(400).send(e) }
// })

// delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user.id})
        if(!task) {return res.status(404).send()}
        res.send(task)
    } catch(e) { res.status(500).send(e)}
})

// delete a task (deprecated)
// router.delete('/tasks/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)
//         if(!task) {return res.status(404).send()}
//         res.send(task)
//     } catch(e) { res.status(500).send(e)}
// })

module.exports = router