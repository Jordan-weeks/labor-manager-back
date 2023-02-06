import express from "express";
import {
  getAssignedJobs,
  createNewJob,
  deleteJob,
  updateJob,
} from "../controllers/jobController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const router = express.Router();
router.use(verifyJWT);
router
  .route("/")
  .get(getAssignedJobs)
  .post(createNewJob)
  .patch(updateJob)
  .delete(deleteJob);
// router.route("/:id").get(getSelectUser);
