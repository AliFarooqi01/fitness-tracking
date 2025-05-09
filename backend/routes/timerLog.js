const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addTimerLog, getTimerLogs } = require("../controllers/timerLogController");

const router = express.Router();

router.post("/add", protect, addTimerLog);
router.get("/get", protect, getTimerLogs);

module.exports = router;
