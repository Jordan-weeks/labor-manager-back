import { model, Schema } from 'mongoose'
import { taskSchema } from './Task.js'

const jobSchema = new Schema({
  jobName: {
    type: String,
    required: true,
  },
  jobNumber: {
    type: String,
  },
  tasks: [taskSchema],
  usersOnJob: [
    {
      userId: String,
      role: String,
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
})

export const Job = model('Job', jobSchema)
