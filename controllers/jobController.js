import expressAsyncHandler from "express-async-handler";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";

// @desc Get jobs assigned to logged in user
// @route GET /jobs
// @access Private

export const getAssignedJobs = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const foundUser = await User.findById(id).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "Invalid userId." });
  }
  const jobs = await Job.find({ usersOnJob: id }).exec();

  if (!jobs) {
    return res.status(204).json({ message: "No jobs assigned to user." });
  } else res.json(jobs);
});
export const getIndividualJob = expressAsyncHandler(async (req, res) => {
  const { jobId } = req.params;
  console.log(jobId);
  // const foundUser = await User.findById(id).exec();

  // if (!foundUser) {
  //   return res.status(400).json({ message: "Invalid userId." });
  // }
  const job = await Job.find({ _id: jobId }).exec();

  if (!job) {
    return res.status(400).json({ message: "Invalid jobId.." });
  } else res.json(job);
});

// @desc Create new job
// @route POST /jobs
// @access Private

export const createNewJob = expressAsyncHandler(async (req, res) => {
  const { jobName, userId } = req.body;
  const foundUser = await User.findById(userId).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "Invalid userId." });
  }
  if (!jobName) {
    return res.status(400).json({ message: "Please enter a job name" });
  }

  const job = await Job.create({ jobName, usersOnJob: userId });
  if (job) {
    res.status(201).json({ message: `Job ${jobName} successfully created.` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});

// @desc update job
// @route PATCH /jobs
// @access Private
export const updateJob = expressAsyncHandler(async (req, res) => {
  const { id, tasks, usersOnJob, active } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID required for lookup" });
  }

  const job = await Job.findById(id).exec();

  if (!job) {
    return res.status(400).json({ message: "Job not found" });
  }
  if (tasks) {
    job.tasks = tasks;
  }
  if (usersOnJob) {
    job.usersOnJob = usersOnJob;
  }
  if (active) {
    job.active = active;
  }

  const updatedJob = await job.save();
  res.json({ message: `${updatedJob.jobName} is updated` });
});

// @desc Delete Job
// @route DELETE /jobs
// @access Private

export const deleteJob = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Job ID Required" });
  }

  const job = await Job.findById(id).exec();
  if (!job) {
    return res.status(400).json({ message: "job not found" });
  }

  const result = await job.deleteOne();
  const reply = `job ${result.jobName} with ID ${result._id} deleted`;
  res.json(reply);
});
