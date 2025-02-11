import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const key = process.env.JWT_SECRET || "my_secret_key";

// Function to generate a random referral code
const generateReferralCode = () => Math.random().toString(36).slice(-6).toUpperCase();

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralCode = generateReferralCode();

    let newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy:null,
    });

    await newUser.save();

    // Link referred user if referralCode exists
    if (referralCode) {
      let referrerUser = await User.findOne({ referralCode });
      if (referrerUser) {
        referrerUser.referredTo.push(newUser._id);
        newUser.referredBy = referrerUser._id;
        await referrerUser.save();
      }
    }

    await newUser.save();
    return res.status(201).json({ msg: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User does not exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, key, { expiresIn: "1d" });
    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Fetch User Profile
export const getProfile = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ msg: "User ID is required" });
  
      // Find user and select only referredBy and referredTo fields
      const user = await User.findById(id).select("referredBy referredTo");
  
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      return res.status(200).json({ 
        referredBy: user.referredBy, 
        referredToUsers: user.referredTo 
      });
  
    } catch (error) {
      return res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  