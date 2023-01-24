import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  //   roles: [
  //     {
  //       type: String,
  //       default: "Employee",
  //     },
  //   ],
  active: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.model("User", userSchema);
