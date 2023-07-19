import express from 'express'
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getSelectUser,
  updateUser,
} from '../controllers/userController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

export const router = express.Router()
router.route('/').post(createNewUser)
router.use(verifyJWT)
router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser)
router.route('/:id').get(getSelectUser)
