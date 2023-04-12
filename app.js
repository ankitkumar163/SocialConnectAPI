const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/posts");

const app = express();

// Set up MongoDB connection
mongoose.connect(
  "mongodb+srv://iankit163:6OTrL4DZ6RWa4LTu@socialconnect.jkxul9b.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

// console log all the collections in the database

// Set up body-parser middleware
app.use(bodyParser.json());

// Set up routes
app.use("/api/", postRoutes);

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));
