import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { Job } from '../models/Job.js'
import { User } from '../models/User.js'

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

export const jobAuth = (permissions) => {
  return (req, res, next) => {
    const cookies = req.cookies
    const { jobId } = req.body

    if (!cookies?.jwt) {
      return res.status(401).json({ message: 'Unauthorized no jwt cookie' })
    }

    const refreshToken = cookies.jwt

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      expressAsyncHandler(async (err, decoded) => {
        const { userId } = decoded

        if (err) return res.status(403).json({ message: 'Forbidden' })

        const foundUser = await User.findById(userId)
        const foundJob = await Job.findById(jobId)
        const user = foundJob.usersOnJob.find((user) => user.userId === userId)

        if (permissions.includes(user.role)) {
          next()
        } else {
          return res.status(403).json({ message: 'Forbidden' })
        }
      })
    )
  }
}
