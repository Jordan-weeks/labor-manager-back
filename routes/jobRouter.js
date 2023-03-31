import express from 'express'
import {
  createNewJob,
  deleteJob,
  getAssignedJobs,
  getIndividualJob,
  getUsernames,
  updateJob,
} from '../controllers/jobController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

export const router = express.Router()
// router.use(verifyJWT);
router.route('/').post(createNewJob)
router.route('/update-job').patch(updateJob)
router.route('/delete-job').delete(deleteJob)
router.route('/:id').get(getAssignedJobs)
router.route('/usernames/:jobId').get(getUsernames)
// router.route('/:jobId').get(getIndividualJob)
