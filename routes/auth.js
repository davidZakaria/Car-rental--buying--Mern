const express = require("express");
// const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const router = express.Router();
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});
function validateUser(req) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports = router;
