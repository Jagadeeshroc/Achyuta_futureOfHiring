const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, getJob,deleteJob, updateJob , applyJob } = require("../controllers/jobs");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createJob);
router.get("/", getAllJobs);
router.get('/:id', getJob);

router.delete('/:id', authMiddleware, deleteJob);
router.put('/:id', authMiddleware, updateJob);
router.post("/:id/apply", authMiddleware, applyJob);



module.exports = router;