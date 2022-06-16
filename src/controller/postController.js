const postModel = require("../model/postModel");
const fs = require("fs"); //For Using File System
const mongoObjectId = require("mongodb");
//Upload Post From User
exports.uploadPost = async (req, res) => {
  const post = new postModel(JSON.parse(JSON.stringify(req.body)));
  post.userId = req.user._id;

  let postname = [];
  for (let i = 0; i < req.files.length; i++) {
    postname.push(req.files[i].filename);
  }
  post.postName = postname;
  await post.save();

  res.send({
    message: "Post Successfully",
  });
};

//Get All Post From Specific User
exports.getUserAllPost = async (req, res) => {
  const userId = req.user._id.toString();

  const data = await postModel.find(
    { userId: userId },
    { postName: true, location: true, caption: true, likes: true }
  );

  const userData = [];

  //For Get User Post data
  for (i = 0; i < data.length; i++) {
    for (j = 0; j < data[i].postName.length; j++) {
      data[i].postName[j] =
        "http://Localhost:3000/userPost/" + data[i].postName[j];
    }
    userData.push(data[i]);
  }

  res.send({
    Message: "User Data",
    data: userData,
  });
};

//Edit User Specific Post
exports.editUserPost = async (req, res) => {
  const editData = await postModel.findOneAndUpdate(
    { _id: req.body.postId },
    { $set: { location: req.body.location, caption: req.body.caption } },
    { new: true }
  );
  console.log("editData", editData);
  res.send({
    message: "User Post Data Update",
    data: editData,
  });
};

//Delete User Specific post
exports.deleteUserPost = async (req, res) => {
  const deletePost = await postModel.find({ _id: req.body.postId });

  for (i = 0; i < deletePost.length; i++) {
    for (j = 0; j < deletePost[i].postName.length; j++) {
      const filePath =
        "../instagram-clone1/uploadUserPost/" + deletePost[i].postName[j];

      await fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }

  const deletepost = await postModel.deleteOne({ _id: req.body.postId });

  res.send({
    message: "Delete Sucessfully",
  });
};

//Get All Db Post
exports.getAllPost = async (req, res) => {
  const allPost = await postModel.find({});

  const userData = [];

  for (i = 0; i < allPost.length; i++) {
    for (j = 0; j < allPost[i].postName.length; j++) {
      allPost[i].postName[j] =
        "http://Localhost:3000/userPost/" + allPost[i].postName[j];
    }
    userData.push(data[i]);
  }

  res.send({
    Message: "User Data",
    data: userData,
  });
};

//Post Like
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
