import { User } from "../models/User.js";
// import { Note } from "../models/Note.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// @desc Get all users
// @route GET /users
// @access Private

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "no users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private

export const createNewUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //confirm data
  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  // check duplicates
  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Email already registered" });
  }
  // hash password
  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = { email, password: hashedPwd };
  // create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New email: ${email} registered!` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});

// @desc Update user
// @route Patch /users
// @access Private

export const updateUser = expressAsyncHandler(async (req, res) => {
  const { id, email, firstName, lastName, active, password } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID required for lookup" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // check for duplicates
  const duplicate = await User.findOne({ email }).lean().exec();
  // allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  if (email) {
    user.email = email;
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (active) {
    user.active = active;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.email} is updated` });
});

// @desc Delete user
// @route DELETE /users
// @access Private

export const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const result = await user.deleteOne();
  const reply = `email ${result.email} with ID ${result._id} deleted`;
  res.json(reply);
});
