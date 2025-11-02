const express = require("express");
const router = express.Router();
const {
  authentication,
  authorize,
  authenticate,
} = require("../middlewares/auth");

router.get("/getdata", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    msg: "Admin Access Granted!",
    data: {
      secreteStats: "Admin-only confidential data",
      user: req.user,
    },
  });
});

module.exports = router;
