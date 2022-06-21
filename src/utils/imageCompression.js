const sharp = require("sharp");
const path = require("path"); //For used Specific Path
const fs = require("fs"); //For Using File System

exports.imageCompression = async (image) => {
  const ref = image.fieldname + "-" + Date.now() + "-" + image.originalname.replace(/\s/g, "");
  await sharp(image.path)
    .jpeg({ quality: 70 })
    .toFile(path.resolve(image.destination, "resized", ref));
  fs.unlinkSync(image.path);

  let link = "http://localhost:3000/uploadUserProfile/resized/" + ref;
  return link;
};




exports.postCompression =async(post) =>{
  const ref = post.fieldname + "-" + Date.now() + "-" + post.originalname.replace(/[^a-zA-Z0-9.]/g, "");
  await sharp(post.path)
    .jpeg({ quality: 70 })
    .toFile(path.resolve(post.destination, "resizedPost", ref));
  fs.unlinkSync(post.path);

  let link = "http://localhost:3000/uploadUserPost/resizedPost/" + ref;
  return link;
}