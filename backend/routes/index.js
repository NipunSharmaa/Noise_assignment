const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const sleepRouter = require("./sleep");

router.use("/user", userRouter);
router.use("/sleep", sleepRouter);

module.exports = router;

