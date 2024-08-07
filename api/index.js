const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
require("dotenv").config({ path: "../.env" });
const Newsletter = require("./models/Newsletter");
const sharp = require("sharp");
const cron = require("node-cron");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 10000;

const allowedOrigins = [process.env.FE_LINK_1, process.env.FE_LINK_2];

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per minute
  message: "Too many requests from this IP, please try again later.",
});

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error(err));

app.post("/newsletter", async (req, res) => {
  try {
    const { name, email } = req.body;

    // check if the email already exists in the database
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.json({ message: "Already Subscribed" });
    }

    // insert the new subscriber into the database
    const newSubscriber = new Newsletter({ name, email });
    await newSubscriber.save();
    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/register", limiter, async (req, res) => {
  const { username, password } = req.body;
  // Check for SQL injection characters in username
  if (/;|'|/.test(username)) {
    return res.status(400).json({ error: "Invalid characters in username" });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create a new user
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(201).json(userDoc); // Use 201 Created for successful user creation
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", limiter, async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { httpOnly: true }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Invalid Username or Password!");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  jwt.verify(token, secret, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: "Unauthorized access" });
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;

  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res
        .status(400)
        .json("Changes cannot be made. You are not the Author!");
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    if (newPath) {
      postDoc.cover = newPath;
    }
    await postDoc.save();
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from the query string
  const limit = 10; // Number of posts per page
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.json({ posts, hasMore });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

// Function to convert images to webp format
const convertImagesToWebp = async () => {
  try {
    const posts = await Post.find();

    for (let post of posts) {
      const coverPath = post.cover;
      if (coverPath && !coverPath.endsWith(".webp")) {
        const webpPath = coverPath.replace(/\.[^/.]+$/, ".webp");
        await sharp(coverPath).toFormat("webp").toFile(webpPath);
        post.cover = webpPath;
        await post.save();
        fs.unlinkSync(coverPath); // Remove the original image
      }
    }
    console.log("Images converted to WebP format");
  } catch (error) {
    console.error("Error converting images to WebP:", error);
  }
};

// Schedule the task to run every hour
cron.schedule("0 * * * *", convertImagesToWebp);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App running on Port: ${PORT}`);
});
