const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const upload = require("../middlewares/upload");
const Image = require("../models/Image");
const mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var conn = mongoose.createConnection(process.env.MONGO_URI)
var gfs
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('photos')
  console.log('Connection Successful')
})

exports.uploadImage = asyncHandler(async (req, res, next) => {
  try {
    await upload(req, res);

    const images = req.files;

    images.forEach(async image => {
      const{fieldname, originalname, mimetype, bucketName, filename, chunkSize, size, md5, contentType} = image
      const fileID = image.id
      const user = req.user.id

      const imageUpload = await Image.create({
        mimetype,
        originalname,
        fieldname,
        bucketName,
        filename,
        chunkSize,
        size,
        md5,
        contentType,
        fileID,
        user
      });
    });


    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    res.status(201).json({
        success: true,
        message: "Images have been uploaded"
    });
  } catch (error) {
    console.log(error);
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
});

exports.deleteOneImage = asyncHandler(async (req, res, next) => {
  const imageID = req.params.imageID
  const image = await Image.findById(imageID)
  if(!image){
    res.status(404).json({
      success: false,
      message: "Images not found"
    });
  }

  if(image.user != req.user.id){
    return next(new ErrorResponse("Unauthorized access", 401));
  }

  //Get original file from photos.files collection
  await gfs.files.findOne({_id:image.fileID}, (err, file) => {
    //check if files exist
    if (!file || file.length == 0) {
      return res.status(404).json({
          err: "No files exist"
      })
    }
    //file exist so delete from collections. throw error if delete fails
    gfs.remove({ _id: image.fileID, root: 'photos' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err })
      }
    })
  })

  //Delete file reference from the Images Table
  try{
    await image.remove()
  }catch(error){
      return next(new ErrorResponse("Server error. Could not delete Image", 500));
  }

  //Return response
  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
  });
})


exports.deleteMultipleImages = asyncHandler(async (req, res, next) => {
  const imageID = req.params.imageID
  const image = await Image.findById(imageID)
  if(!image){
    res.status(404).json({
      success: false,
      message: "Images not found"
    });
  }

  if(image.user != req.user.id){
    return next(new ErrorResponse("Unauthorized access", 401));
  }

  //Get original file from photos.files collection
  await gfs.files.findOne({_id:image.fileID}, (err, file) => {
    //check if files exist
    if (!file || file.length == 0) {
      return res.status(404).json({
          err: "No files exist"
      })
    }
    //file exist so delete from collections. throw error if delete fails
    gfs.remove({ _id: image.fileID, root: 'photos' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err })
      }
    })
  })

  //Delete file reference from the Images Table
  try{
    await image.remove()
  }catch(error){
      return next(new ErrorResponse("Server error. Could not delete Image", 500));
  }

  //Return response
  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
  });
})

