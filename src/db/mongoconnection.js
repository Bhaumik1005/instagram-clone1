const URL = process.env.DBURL;
const mongoose = require("mongoose");

//For Connect Mongoose
exports.DbConnection = async () => {
  await mongoose
    .connect(URL, {
      useNewUrlParser: true,
    })
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
};
