import expressAsyncHandler from 'express-async-handler'
import { createTransport } from 'nodemailer'
import { Invite } from '../models/Invite.js'
import { Job } from '../models/Job.js'
import { Task } from '../models/Task.js'
import { User } from '../models/User.js'

const EMAIL_USERNAME = process.env.EMAIL_USERNAME
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
// @desc Get jobs assigned to logged in user
// @route GET /jobs
// @access Private

export const getAssignedJobs = expressAsyncHandler(async (req, res) => {
  const { id } = req.params

  const foundUser = await User.findById(id).exec()

  if (!foundUser) {
    return res.status(400).json({ message: 'Invalid userId.' })
  }
  const jobs = await Job.find({ usersOnJob: id }).exec()

  if (!jobs) {
    return res.status(204).json({ message: 'No jobs assigned to user.' })
  } else res.json(jobs)
})

export const getIndividualJob = expressAsyncHandler(async (req, res) => {
  const { jobId } = req.params
  // const foundUser = await User.findById(id).exec();

  // if (!foundUser) {
  //   return res.status(400).json({ message: "Invalid userId." });
  // }
  const job = await Job.find({ _id: jobId }).exec()

  if (!job) {
    return res.status(400).json({ message: 'Invalid jobId..' })
  } else res.json(job)
})

// @desc Get usernames for job
// @route GET /jobs/get-usernames
// @access Private

export const getUsernames = expressAsyncHandler(async (req, res) => {
  const { jobId } = req.params

  if (!jobId) {
    return res.json({ message: 'Job Id required for lookup.' })
  }

  const job = await Job.findById(jobId).exec()
  const users = job.usersOnJob

  const getFullNames = async () => {
    const fullNames = Promise.all(
      users.map(async (userId) => {
        const user = await User.findById(userId)
        const fullName = `${user.firstName} ${user.lastName}`

        return { userId, fullName }
      })
    )
    return fullNames
  }
  const data = await getFullNames()

  console.log(data)
  return res.status(200).json(data)
})

// @desc Create new job
// @route POST /jobs
// @access Private

export const createNewJob = expressAsyncHandler(async (req, res) => {
  const { jobName, jobNumber, userId } = req.body
  const foundUser = await User.findById(userId).exec()

  if (!foundUser) {
    return res.status(400).json({ message: 'Invalid userId.' })
  }
  if (!jobName) {
    return res.status(400).json({ message: 'Please enter a job name' })
  }

  const job = await Job.create({
    jobName,
    jobNumber,
    usersOnJob: userId,
    active: true,
  })
  if (job) {
    res.status(201).json({ message: `Job ${jobName} successfully created.` })
  } else {
    res.status(400).json({ message: 'invalid user data received' })
  }
})

// @desc update job
// @route PATCH /jobs
// @access Private
export const updateJob = expressAsyncHandler(async (req, res) => {
  const { jobId, jobName, jobNumber, usersOnJob, active } = req.body
  console.log(req.body)

  if (!jobId || !jobName || typeof active !== 'boolean') {
    return res
      .status(400)
      .json({ message: 'Job ID, Job name and active status required.' })
  }

  const job = await Job.findById(jobId).exec()

  if (!job) {
    return res.status(404).json({ message: 'Job not found' })
  }
  if (jobName) {
    job.jobName = jobName
  }
  if (jobNumber) {
    job.jobNumber = jobNumber
  }
  if (usersOnJob) {
    job.usersOnJob = usersOnJob
  }

  job.active = active
  const updatedJob = await job.save()
  res.json({ message: `${updatedJob.jobName} is updated` })
  console.log(updatedJob)
})

// @desc Delete Job
// @route DELETE /jobs
// @access Private

export const deleteJob = expressAsyncHandler(async (req, res) => {
  const { jobId } = req.body

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID Required' })
  }

  const job = await Job.findById(jobId).exec()
  if (!job) {
    return res.status(400).json({ message: 'job not found' })
  }

  const result = await job.deleteOne()
  const reply = `job ${result.jobName} with ID ${result._id} deleted`
  res.json(reply)
})

// @desc send job invite link email
// @route POST /jobs/invite
// @access Private

export const sendJobInvite = expressAsyncHandler(async (req, res) => {
  const { jobId, email, role } = req.body
  console.log(req.body)

  if (!jobId) {
    return res.status(400).json({ message: 'Job ID Required' })
  }
  if (!email) {
    return res.status(400).json({ message: 'Email required for invite.' })
  }
  if (!role) {
    return res
      .status(400)
      .json({ message: 'Role must be assigned with invite.' })
  }

  const invite = await Invite.create({
    jobId,
    email,
    role,
  })
  if (invite) {
    res.status(201).json({ message: `Invite sent` })
  } else {
    res.status(400).json({ message: 'invalid user data received' })
  }
  console.log(invite)

  const transporter = createTransport({
    host: 'smtppro.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: 'welcome@jobboost.app',
      pass: EMAIL_PASSWORD,
    },
  })

  const mailOptions = {
    from: 'welcome@jobboost.app',
    to: email,
    subject: "You've been invited to join!",
    text: `Someone has invited you to join their job at JobBoost. \n Click the link to join: \n jobboost.app/join/${invite._id} \n localhost:5173/join/${invite._id}`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
})
export const joinJob = expressAsyncHandler(async (req, res) => {
  const { inviteId, userId } = req.body
  const invite = await Invite.findOne({ _id: inviteId })
  const foundUser = await User.findById(userId)
  const foundJob = await Job.findById(invite.jobId)
  if (!invite) {
    return res.status(404).json({ message: 'invite not found' })
  }
  if (!userId) {
    return res.status(400).json({ message: 'User ID required to join' })
  }
  if (!foundUser) {
    return res.status(400).json({ message: 'Invalid user ID' })
  }
  if (!foundJob) {
    return res.status(400).json({ message: 'Invalid job ID' })
  }
  if (invite.email !== foundUser.email) {
    return res
      .status(401)
      .json({ message: 'User email does not match invite email' })
  }
  if (foundJob.usersOnJob.includes(userId)) {
    return res.status(400)
  }
  foundJob.usersOnJob.push(userId)
  await foundJob.save()
  return res
    .status(200)
    .json({ message: `${foundUser.firstName} successfully added to job.` })
})
