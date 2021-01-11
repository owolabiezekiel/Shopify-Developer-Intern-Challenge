const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    fieldname: {
        type: String,
    },
    originalname: {
        type: String
    },
    mimetype: {
        type: String,
    },
    filename: {
        type: String,
    },
    bucketName: {
        type: String,
    },
    chunkSize: {
        type: Number,
    },
    size: {
        type: Number,
    },
    md5: {
        type: String,
    },
    contentType: {
        type: String,
    },
    fileID:{
        type: mongoose.Schema.ObjectId,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
},
{ 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
})

module.exports = mongoose.model("Image", ImageSchema);