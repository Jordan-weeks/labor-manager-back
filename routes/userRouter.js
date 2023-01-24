import express from "express";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
// import { verifyJWT } from "../middleware/verifyJWT.js";

export const router = express.Router();
// router.use(verifyJWT);
router
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);
