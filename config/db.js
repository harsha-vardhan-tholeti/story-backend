const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
