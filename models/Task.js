import { model, Schema } from 'mongoose'
const commentSchema = new Schema({
  body: String,
  author: String,
  edited: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
})
const assignedUserSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
})
export const taskSchema = new Schema({
  taskName: {
    type: String,
    required: true,
  },
  assignees: [assignedUserSchema],

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
