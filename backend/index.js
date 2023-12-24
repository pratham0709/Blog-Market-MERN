const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uploadOnCloudinary = require("./utils/cloudinary");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const { throws } = require("assert");

//database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database is connected successfully! 🌠🌠🌠1️⃣1️⃣");
  } catch (err) {
    console.log(err);
  }
};

//middlewares
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

const storage = multer.memoryStorage(); // Use memory storage to handle the file in-memory
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded! ❌",
      });
    }

    const coverImageBuffer = req.file.buffer;
    const coverImage = await uploadOnCloudinary(coverImageBuffer);

    res.status(200).json({
      message: "Image has been uploaded successfully! ✔️",
      imageUrl: coverImage.url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running on port " + process.env.PORT);
});
