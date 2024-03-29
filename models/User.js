const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [/.{1,}@[^.]{1,}/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please input your password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
{ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }, 
});

//Encrypt Password middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPasswords = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Generate and has password reset token
UserSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

//Reverse Populate with virtuals
UserSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "user",
  justone: false,
});

module.exports = mongoose.model("User", UserSchema);
