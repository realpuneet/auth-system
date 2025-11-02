const express = require("express");
const Joi = require("joi");
const validate = require("../middlewares/validate");
const authController = require("../controllers/auth.controller");

const router = express.Router();

//Joi Schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post("/register",validate(registerSchema), authController.register);
router.post("/login",validate(loginSchema), authController.login);
router.post("/logout", authController.logout);


module.exports = router;
