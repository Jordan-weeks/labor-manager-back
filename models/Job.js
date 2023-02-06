import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  jobName: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
  },
  usersOnJob: {
    type: Array,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export const Job = model("Job", jobSchema);
