import dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'
import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

//@desc Login
//@route Post /auth
//@access Public

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized no found user' })
  }
  console.log('found user' + foundUser)
  const userData = await User.findOne({ email }).select('+_id').lean()

  const userId = userData._id

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: 'Unauthorized no match' })

  const accessToken = jwt.sign(
    {
      UserInfo: {
        userId: foundUser._id,
      },
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '10s' }
  )

  const refreshToken = jwt.sign(
    { email: foundUser.email, userId: foundUser._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  //create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: 'None', // cross- site cookie needed for backend hosted separate from front end
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refresh token
  })

  // send accessToken containing username and roles

  res.json({ accessToken, userId })
})

//@desc Refresh
//@route GET /auth/refresh
//@access Public - because access token has expired
export const refresh = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'unauthorized no jwt cookie' })
  }

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    expressAsyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await User.findOne({ email: decoded.email })
      const userId = foundUser._id

      if (!foundUser) return res.status(401).json({ message: 'unauthorized' })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            userId: foundUser._id,
            active: foundUser.active,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      )
      res.json({ accessToken, userId })
    })
  )
}

//@desc Logout
//@route POST /auth/logout
//@access Public - just to clear cookie if exists
export const logout = expressAsyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) //same cookie setting required
  res.json({ message: 'Cookie cleared' })
})
