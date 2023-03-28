import { model, Schema } from 'mongoose'
const commentSchema = new Schema({
  body: String,
  author: String,
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

export const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  estimatedHours: {
    type: Number,
  },
  comments: [commentSchema],
})

export const Task = model('Task', taskSchema)
