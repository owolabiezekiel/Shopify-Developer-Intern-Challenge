const express = require("express");
const { get } = require("mongoose");

const {
  registerUser,
  login,
  getMe,
  updateMe,
  getFullProfile
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/fullprofile", protect, getFullProfile);
router.put("/me", protect, updateMe);

module.exports = router;
