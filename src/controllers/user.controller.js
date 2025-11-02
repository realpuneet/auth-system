const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function profile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: " Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    res.status(200).json({
      message: " User fetched successfully ",
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
}

module.exports = { profile };
