const Joi = require("joi"); // For Validating Req Objct Data
Joi.objectId = require("joi-objectid")(Joi);
const fs = require("fs"); // For using File Sysytem
const { required } = require("joi");
const logger = require("../utils/logger").logger;

/*Validate User Authentication Data */

//For validate the user Register data
exports.validateRegisterUser = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string()
      .trim()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in", "cloud"] },
      })
      .required(),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    age: Joi.string().min(0).max(50).required(),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    isEmailValide: Joi.boolean().default(false),
  });

  const { name, email, password, age, phoneNumber, isEmailValide } = req.body;

  const { error } = schema.validate({
    name,
    email,
    password,
    age,
    phoneNumber,
    isEmailValide,
  });

  if (error) {
    const email = req.body.email;
    const filePath =
      "../instagram-clone/uploadUserProfile/" + email + "_profilePic.png";

    await fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });

    logger.error(`[${req.method}] [${req.originalUrl}] [${error}]`);
    res.status(500).send({
      error: error.message,
    });
  } else {
    return next();
  }
};

//For Validate User Login Data
exports.validateUserLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in", "cloud"] },
      })
      .required(),
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  const { email, password } = req.body;

  const { error } = schema.validate({ email, password });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

//For Validate User Updated Data
exports.validateUpdatedData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    age: Joi.string().min(1).max(5).required(),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });

  const { name, age, phoneNumber } = req.body;

  const { error } = schema.validate({ name, age, phoneNumber });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

//For Validate User Updated Data
exports.validateForgotPassword = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in", "cloud"] },
      })
      .required(),
  });

  const { email } = req.body;

  const { error } = schema.validate({ email });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateResetPassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  const { password } = req.body;

  const { error } = schema.validate({ password });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};
/*------------------------------------------------------------- */

/* Validate User Post */
exports.validateUploadPost = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$")),
    caption: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$")),
  });

  const { location, caption } = req.body;

  const { error } = schema.validate({ location, caption });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateEditPost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId(),
    location: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$")),
    caption: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$")),
  });

  const { postId, location, caption } = req.body;

  const { error } = schema.validate({ postId, location, caption });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateDeletePost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateLikePost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

/*------------------------------------------------------------- */

/*Validate Post Comments */
exports.validateComment = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    message: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$"))
      .required(),
  });

  const { postId, message } = req.body;

  const { error } = schema.validate({ postId, message });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateGetAllComment = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateEditComment = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
    message: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$"))
      .required(),
  });

  const { postId, message, commentId } = req.body;

  const { error } = schema.validate({ postId, message, commentId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateDeleteComment = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
  });

  const { postId, commentId } = req.body;

  const { error } = schema.validate({ postId, commentId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateCommentReply = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
    message: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$"))
      .required(),
  });

  const { postId, commentId, message } = req.body;

  const { error } = schema.validate({ postId, commentId, message });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateEditCommentReply = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
    replyId: Joi.objectId().required(),
    replyMessage: Joi.string()
      .min(2)
      .max(50)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,50}$"))
      .required(),
  });

  const { postId, commentId, replyId, replyMessage } = req.body;

  const { error } = schema.validate({
    postId,
    commentId,
    replyId,
    replyMessage,
  });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateDeleteCommentReply = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    commentId: Joi.objectId().required(),
    replyId: Joi.objectId().required(),
  });

  const { postId, commentId, replyId } = req.body;

  const { error } = schema.validate({ postId, commentId, replyId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

/*------------------------------------------------------- */

/*Validate Bookmark Post*/
exports.validateBookmarkPost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateGetBookmarkPost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};

exports.validateDeleteBookmarkPost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
  });

  const { postId } = req.body;

  const { error } = schema.validate({ postId });

  if (error) {
    res.status(500).json({
      error: error.message,
    });
  } else {
    return next();
  }
};