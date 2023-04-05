import { model, Schema } from 'mongoose'

const inviteSchema = new Schema({
  jobId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h',
  },
})

export const Invite = model('Invite', inviteSchema)
