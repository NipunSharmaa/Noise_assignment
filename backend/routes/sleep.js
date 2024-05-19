const express = require("express");
const mongoose= require("mongoose")
const zod= require("zod");
const { authMiddleware } = require("../middleware/middleware");
const { User, Sleep } = require("../db/db");
const router = express.Router();



router.post("/", authMiddleware,async (req, res) => {


  try {
    // Checking if the user exists
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.hours < 0) {
      return res.status(411).json({ message: "Invalid credentials!" });
    }

    // Saving the sleep data
    const sleep = await Sleep.create({
   
      hours: req.body.hours,
      timestamp: req.body.timestamp,
      userId: req.body.userId
    });

    return res.status(201).json({
      message: "Sleep data saved successfully!",
    
    });
  } catch (err) {
   
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/:userId", authMiddleware,async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    console.log(page);
    if (page<1|| limit<0){
      return res.status(401).json({
        message:"Invalid page credentials"
      })
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculating the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetching sleep records for the specified user, sorted by date in descending order, with pagination
    const sleepRecords = await Sleep.find({ userId })
      .sort({ timestamp: -1 }) // Sorting by timeStamp in descending order
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Sleep records retrieved successfully",
      sleepRecords,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:recordId",authMiddleware, async (req, res) => {
  try {
    const recordId = req.params.recordId;

    // Finding the sleep record by ID
    const sleepRecord = await Sleep.findById(recordId);
    if (!sleepRecord) {
      return res.status(404).json({ message: "Sleep record not found" });
    }

    // Deleting the sleep record from the database
    await Sleep.deleteOne({ _id: recordId });

    return res.status(200).json({ message: "Sleep record deleted successfully" });
  } catch (error) {
   console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
