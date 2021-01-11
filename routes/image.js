const express = require("express");

const {
    uploadImage,
    deleteOneImage
} = require("../controllers/image");

const router = express.Router();

const { protect } = require("../middlewares/auth");

router.post("/upload", protect, uploadImage);
router.route("/:imageID").delete(protect, deleteOneImage);

module.exports = router; 
