const postModel = require("../model/postModel");
const fs = require("fs"); //For Using File System
const Compression = require("../utils/imageCompression"); //PostImage Compression Logic File
const path = require("path");

/*User Instagram Post Logic*/
exports.uploadPost = async (req, res) => {
  try {
    const post = new postModel(JSON.parse(JSON.stringify(req.body)));
    post.userId = req.user._id;

    let postname = [];
    for (let i = 0; i < req.files.length; i++) {
      /* Image Compression Logic */
      const ImageLink = await Compression.postCompression(req.files[i]);
      postname.push(ImageLink);
    }

    post.postName = postname;
    await post.save();

    res.send({
      message: "Post Successfully",
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Get All Post From Specific User Logic*/
exports.getUserAllPost = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const data = await postModel.find(
      { userId: userId },
      { postName: true, location: true, caption: true, likes: true }
    );

    res.send({
      Message: "User Data",
      data: data,
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Edit User Specific Post*/
exports.editUserPost = async (req, res) => {
  try {
    const editData = await postModel.findOneAndUpdate(
      { _id: req.body.postId },
      { $set: { location: req.body.location, caption: req.body.caption } },
      { new: true }
    );

    res.send({
      message: "User Post Data Update",
      data: editData,
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Delete User Specific post*/
exports.deleteUserPost = async (req, res) => {
  try {
    const deletePost = await postModel.findOne({ _id: req.body.postId });

    if (deletePost) {
      for (i = 0; i <= deletePost.postName.length; i++) {
        let postName = deletePost.postName[i].split("/")[5];

        let filePath = path.join(
          __dirname,
          "../../uploadUserPost/resizedPost/" + postName
        );

        await fs.unlink(filePath, (err) => {
          console.log(err);
        });
      }

      const deletePostDb = await postModel.deleteOne({
        _id: req.body.postId,
      });

      if (deletePostDb.deletedCount > 0) {
        res.send({
          message: "Delete Sucessfully",
        });
      } else {
        res.send({
          message: "Can't Delete Post",
        });
      }
    } else {
      res.send({
        message: "Can't Find Your Post",
      });
    }
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/* Get All Db Post*/
exports.getAllPost = async (req, res) => {
  try {
    const allPost = await postModel.find({});

  
    res.send({
      Message: "User Data",
      data: allPost,
    });
  } catch (error) {
    res.send({
      Error: error.message,
    });
  }
};

/*Post Like   In Progress*/
exports.likePost = async (req, res) => {
  const likeData = await postModel.findOne({
    _id: req.body.postId,
    likes: { $elemMatch: { userId: req.user._id } },
  });

  if (likeData) {
    // const unlike = await postModel.findByIdAndUpdate(
    //   { _id: req.body.postId, likes: { $elemMatch: { userId: req.user._id } } },
    //   { likes: { dropIndex: { userId: "", useName: "" } } }
    // );
    // const unlike = await postModel.updateOne(
    //   { $pull: { likes: { $elemMatch: { userId: req.user._id } }}},
    //   { multi: true }
    // );
    // console.log(unlike);
    res.send({});
  } else {
    const like = await postModel.findByIdAndUpdate(
      { _id: req.body.postId },
      { $push: { likes: { userId: req.user._id, userName: req.user.name } } }
    );
    res.send({
      message: "Like Succesfully",
    });
  }
  // if(likeData){
  //   res.send({
  //     message: "You Alredy Liked this Post"
  //   })
  // }else{
  //   const like = await postModel.findByIdAndUpdate(
  //     { _id: req.body.postId },
  //     { $push: { likes: { userId: req.user._id, useName: req.user.name } } }
  //   );
  //   res.send({
  //     message: "Like Succesfully",
  //   });
  // }
};
