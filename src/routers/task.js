const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// create one task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) { res.status(400).send(e) }
})

// read all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) { res.status(500).send(e) }
})

// read one task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {return res.status(404).send()}
        res.send(task)
    } catch(e) { res.status(500).send(e) }
})

// update a task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    if (!isValidOperation) { res.status(400).send({error: 'Invalid update!'}) }
    
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        const task = await Task.findById(req.params.id)
        if (!task) { return res.status(404).send() }
        
        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) { res.status(400).send(e) }
})

// delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const user = await Task.findByIdAndDelete(req.params.id)
        if(!user) {return res.status(404).send()}
        res.send(user)
    } catch(e) { res.status(500).send(e)}
})

module.exports = router