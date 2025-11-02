const userModel = require("../models/user.model");
const redis = require("../services/redisClient");
const { generateToken } = require("../utils/jwt");

async function cacheUser(user) {
  const key = `user:${user._id}`;
  await redis.set(key, JSON.stringify(user), "EX", 60 * 60 * 24);
}

async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User exists!" });
    }

    const user = new userModel({ email, password, role });
    await user.save();

    await cacheUser(user);

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      msg: "User registered!",
      user: { email: user.email, role: user.role, _id: user._id },
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: " User not found ",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = generateToken({ id: user._id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: " User logged In Successfully.",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(token){
      await redis.set(`blacklist:${token}`, "true", "EX", 60 * 60 * 24);
      res.clearCookie("token")
    }
    res.status(200).json({ message: 'Logged out successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { register, login, logout };
