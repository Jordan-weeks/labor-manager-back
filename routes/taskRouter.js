import express from 'express'
import {
  addComment,
  addTask,
  deleteComment,
  deleteTask,
  editComment,
  updateTask,
} from '../controllers/taskController.js'
import { jobAuth } from '../middleware/jobAuth.js'
import { verifyJWT } from '../middleware/verifyJWT.js'
export const router = express.Router()
router.use(verifyJWT)
router.route('/add-task').patch(jobAuth(['admin', 'editor']), addTask)
router.route('/add-comment').patch(addComment)
router.route('/edit-comment').patch(editComment)
router.route('/delete-comment').delete(deleteComment)
router.route('/').patch(updateTask)
router.route('/').delete(deleteTask)
