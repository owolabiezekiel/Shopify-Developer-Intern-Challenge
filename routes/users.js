const express = require("express");
const { protect, authorize } = require("../middlewares/auth");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
