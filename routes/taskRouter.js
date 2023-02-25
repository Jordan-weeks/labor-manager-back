import express from "express";
import {
  updateTask,
  addTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const router = express.Router();
// router.use(verifyJWT);
router.route("/add-task").patch(addTask);
router.route("/").patch(updateTask);
router.route("/").delete(deleteTask);
