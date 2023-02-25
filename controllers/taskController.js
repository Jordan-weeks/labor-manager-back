import expressAsyncHandler from "express-async-handler";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";

// @desc Add task to current job
// @route PATCH /tasks/add-task
// @access Private

export const addTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskName, description, estimatedHours, status } = req.body;
  if (!jobId) {
    return res.status(400).json({ message: "ID required for lookup" });
  }
  const job = await Job.findById(jobId).exec();

  if (!taskName) {
    return res.status(400).json({ message: "Task name is required" });
  }
  const task = await Task.create({
    taskName,
    description,
    estimatedHours,
    status,
  });

  if (!task) {
    res.status(400).json({ message: "invalid user data received" });
  }

  job.tasks.push(task);
  const updatedJob = await job.save();

  res.json({ message: `${task.taskName} added to${updatedJob.jobName}` });
});

// @desc update task
// @route Patch /tasks
// @access Private

export const updateTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId, taskName, description, estimatedHours, status } =
    req.body;
  console.log(req.body);

  if (!jobId) {
    return res.status(400).json({ message: "Job ID required for lookup" });
  }
  const job = await Job.findById(jobId).exec();

  if (!taskId) {
    return res.status(400).json({ message: "Task ID required for lookup" });
  }
  const task = job.tasks.id(taskId);

  if (taskName) {
    task.taskName = taskName;
  }
  if (description) {
    task.description = description;
  }
  if (estimatedHours) {
    task.estimatedHours = estimatedHours;
  }
  if (status) {
    task.status = status;
  }

  await job.save();
  res.json({ message: `${task.taskName} updated` });
});

// @desc delete task
// @route DELETE /tasks
// @access Private

export const deleteTask = expressAsyncHandler(async (req, res) => {
  const { jobId, taskId } = req.body;
  console.log(req.body);
  if (!jobId) {
    return res.status(400).json({ message: "ID required for lookup" });
  }
  const job = await Job.findById(jobId).exec();
  const task = job.tasks.id(taskId);

  job.tasks.id(taskId).remove();
  const updatedJob = await job.save();

  res.json({ message: `${task.taskName} removed from${updatedJob.jobName}` });
});
