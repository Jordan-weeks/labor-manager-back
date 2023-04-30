import express from 'express'
import {
  createNewJob,
  deleteJob,
  getAssignedJobs,
  getIndividualJob,
  getUsernames,
  joinJob,
  sendJobInvite,
  updateJob,
} from '../controllers/jobController.js'
import { jobAuth } from '../middleware/jobAuth.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

export const router = express.Router()
router.use(verifyJWT)
// router.use(jobAuth('admin'))
router.route('/').post(createNewJob)
router.route('/invite').post(sendJobInvite)
router.route('/update-job').patch(updateJob)
router.route('/join').patch(joinJob)
router.route('/delete-job').delete(jobAuth(['admin']), deleteJob)
router.route('/:id').get(getAssignedJobs)
router.route('/usernames/:jobId').get(getUsernames)
router.route('/get-job/:jobId').get(getIndividualJob)
