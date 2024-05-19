const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../db/db");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// zod validation
const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6, "Password should be at least 6 characters long"),
});

router.post("/signup", async (req, res) => {
  const { success, data } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "Invalid credentials." });
  }

  try {
    const existingUser = await User.findOne({
      userName: data.userName,
    });

    if (existingUser) {
      return res.status(411).json({ message: "User already exists." });
    }

    const hashPw = await bcrypt.hash(data.password, 12);
    // storing user in the db
    const user = await User.create({
      userName: data.userName,
      password: hashPw,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const userId = user._id;

    // creating the jwt token for authentication
    const token = jwt.sign({ userId }, JWT_SECRET);
    
    return res.status(200).json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
   
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const signinBody = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success, data } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }

  try {
    const user = await User.findOne({
      userName: data.userName,
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          {
            userId: user._id,
          },
          JWT_SECRET
        );
        
        res.json({
          message: "User signed in successfully!",
          token: token,
        });
        return;
      }
    }

    // If user is not found or password is invalid
    res.status(401).json({
      message: "Invalid username or password",
    });
  } catch (err) {
    res.status(401).json({ message: "Error while signing in!" });
  }
});

//token generation for testing
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

module.exports = router;
module.exports.generateToken = generateToken;