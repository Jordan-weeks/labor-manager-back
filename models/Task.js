import { Schema, model } from "mongoose";

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
});

export const Task = model("Task", taskSchema);
