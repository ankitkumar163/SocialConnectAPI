const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const { generateUniqueId } = require("../helpers/uuid");
const bcrypt = require("bcrypt");

const users = [
  {
    id: 1,
    username: "ankit",
    password: "$2b$10$aKuw1IWckNdIsr1RVqd1MO9tojxWNu4SSts.0I/agb19e4F.JJwJa",
  },
];

var dynamicAuthToken;

// Login API
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id }, "secret_key");

  dynamicAuthToken = token;

  res.json({ token });
});

// ----------------------------------------------------- AUTHENTICATED ROUTES -----------------------------------------------------

// Create a post

// var kJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgxMzIxNzAwfQ.Dkq-HELKyirPx6L3enUmqpXfVVZgRJiIF8SfzWQzzQA';
router.post("/", async (req, res) => {
  const { authorization } = req.headers;
  console.log(dynamicAuthToken);
  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const post = new Post({
    title: req.body.title,
    postID: generateUniqueId(),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a post
router.delete("/posts/:id", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a post like by id
router.patch("/posts/togglelike/:id", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const post = await Post.findById(req.params.id);
    post.likes = post.likes === 0 ? 1 : 0;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all posts
router.get("/all_posts", async (req, res) => {
  const { authorization } = req.headers;
  console.log(dynamicAuthToken);

  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a comment to a post by id
router.post("/comment/:id", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ text: req.body.text });
    const updatedPost = await post.save();

    res.status(201).json(updatedPost.comments[updatedPost.comments.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/// get post by id
router.get("/posts/:id", async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${dynamicAuthToken}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------------------------------------------------- NON AUTHENTICATED ROUTES -----------------------------------------------------

// Create a new post and save it to the database
// router.post("/", async (req, res) => {
//   const post = new Post({
//     title: req.body.title,
//     postID: generateUniqueId(),
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//   });

//   try {
//     const newPost = await post.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Delete a post by id
// router.delete("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     await post.deleteOne();
//     res.json({ message: "Post deleted" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Update a post like by id
// router.patch("/:id/togglelike", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     post.likes = post.likes === 0 ? 1 : 0;
//     const updatedPost = await post.save();
//     res.json(updatedPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Post a comment to a post by id
// router.post("/:id/comments", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     post.comments.push({ text: req.body.text });
//     const updatedPost = await post.save();

//     res.status(201).json(updatedPost);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Fetch all posts
// router.get("/all_posts", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
