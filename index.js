const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const AuthRouter = require("./routes/auth.routes");
const UserRouter = require("./routes/user.routes");
const StoryRouter = require("./routes/story.routes");
const ChapterRouter = require("./routes/chapter.routes");
dotenv.config("./.env");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/story", StoryRouter);
app.use("/api/v1/chapter", ChapterRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
