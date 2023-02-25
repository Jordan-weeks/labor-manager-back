import express from "express";
import {
  getAssignedJobs,
  createNewJob,
  deleteJob,
  updateJob,
  getIndividualJob,
} from "../controllers/jobController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const router = express.Router();
// router.use(verifyJWT);
router.route("/").post(createNewJob);
router.route("/update-job").patch(updateJob);
router.route("/delete-job").delete(deleteJob);
router.route("/:id").get(getAssignedJobs);
router.route("/:jobId").get(getIndividualJob);
