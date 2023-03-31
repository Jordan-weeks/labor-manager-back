import expressAsyncHandler from 'express-async-handler'
import { Job } from '../models/Job.js'
import { Task } from '../models/Task.js'
import { User } from '../models/User.js'

// @desc Add task to current job
// @route PATCH /tasks/add-task
// @access Private

export const addTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskName, description, estimatedHours, status } = req.body
  if (!jobId) {
    return res.status(400).json({ message: 'ID required for lookup' })
  }
  const job = await Job.findById(jobId).exec()

  if (!taskName) {
    return res.status(400).json({ message: 'Task name is required' })
  }
  const task = {
    taskName,
    description,
    estimatedHours,
    status,
  }

  if (!task) {
    res.status(400).json({ message: 'invalid user data received' })
  }

  job.tasks.push(task)
  const updatedJob = await job.save()

  res.json({ message: `${task.taskName} added to${updatedJob.jobName}` })
})

// @desc update task
// @route Patch /tasks
// @access Private

export const updateTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId, taskName, description, estimatedHours, status } =
    req.body
  console.log(req.body)

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID required for lookup' })
  }
  const job = await Job.findById(jobId).exec()

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID required for lookup' })
  }
  const task = job.tasks.id(taskId)

  if (taskName) {
    task.taskName = taskName
  }
  if (description) {
    task.description = description
  }
  if (estimatedHours) {
    task.estimatedHours = estimatedHours
  }
  if (status) {
    task.status = status
  }

  await job.save()
  res.json({ message: `${task.taskName} updated` })
})

// @desc delete task
// @route DELETE /tasks
// @access Private

export const deleteTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId } = req.body
  console.log(req.body)
  if (!jobId) {
    return res.status(400).json({ message: 'ID required for lookup' })
  }
  const job = await Job.findById(jobId).exec()
  const task = job.tasks.id(taskId)

  job.tasks.id(taskId).remove()
  const updatedJob = await job.save()

  res.json({ message: `${task.taskName} removed from${updatedJob.jobName}` })
})

// @desc Add comment to a task
// @route PATCH /tasks/add-comment
// @access Private

export const addComment = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId, commentBody, author } = req.body
  if (!jobId) {
    return res.status(400).json({ message: 'Job ID required for lookup' })
  }

  // ? There is probably a better way of doing this without needing the jobId and taskId.

  const job = await Job.findById(jobId).exec()
  const task = job.tasks.id(taskId)

  const comment = { body: commentBody, author }
  job.tasks.id(taskId).comments.push(comment)

  await job.save()
  res.json({ message: `Comment added to ${task.taskName}` })
})

// @desc Edit an existing comment
// @route PATCH /tasks/edit-comment
// @access Private

export const editComment = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId, commentId, commentBody, userId } = req.body

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID required for lookup' })
  }
  if (!taskId) {
    return res.status(400).json({ message: 'Task ID required for lookup' })
  }
  if (!commentId) {
    return res.status(400).json({ message: 'comment Id required for lookup' })
  }

  // ? There is probably a better way of doing this without needing the jobId and taskId.

  const job = await Job.findById(jobId)
  const task = job.tasks.id(taskId)
  const comments = task.comments
  const foundComment = comments.id(commentId)

  if (foundComment.author !== userId) {
    return res.status(400).json({ message: 'Only author can modify comment' })
  }
  if (foundComment.body === commentBody)
    return res.status(204).json({ message: 'No change to comment' })

  foundComment.edited = true
  foundComment.body = commentBody
  foundComment.date = Date.now()
  const updatedComment = await job.save()
  res.json({ message: 'comment updated' })
})

// @desc Delete a comment assigned to a task
// @route DELETE /tasks/delete-comment
// @access Private

export const deleteComment = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId, commentId, userId } = req.body

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID required for lookup' })
  }
  if (!taskId) {
    return res.status(400).json({ message: 'Task ID required for lookup' })
  }
  if (!commentId) {
    return res.status(400).json({ message: 'comment Id required for lookup' })
  }

  const job = await Job.findById(jobId)
  const task = job.tasks.id(taskId)
  const comments = task.comments
  const foundComment = comments.id(commentId)

  if (foundComment.author !== userId) {
    return res.status(400).json({ message: 'Only author can modify comment' })
  }
  foundComment.remove()

  await job.save()
  res.json({ message: 'comment removed' })
})
