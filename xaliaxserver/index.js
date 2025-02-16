// Connect to MongoDB
//const mongoURI = "mongodb+srv://dijidynamics2024:1Password**12345!@evmdb.8l73c.mongodb.net/pandp?retryWrites=true&w=majority&appName=evmdb";
//mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express');
const cors = require('cors')
//upload image
const multer = require("multer");
const path = require("path");

const mongoose = require('mongoose')
const connectDB = require('./db.js')
const User = require('./models/user.js')
const Post = require('./models/post.js')

const app = express()
app.use(cors());
app.use(express.json())
connectDB()

// Set storage engine 
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));

    },
});

const upload = multer({ storage });

//upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {

    console.log("Received file:", req.file); // Debugging
    if(!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded"});
    }
    res.json({ success: true, filename: req.file.filename});
});

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));


// API Get data
app.get('/userlist', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/user/email/:email", async (req, res) => {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send user details
});

app.get("/getpostdetailss", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Fetch in latest order
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

//API login page
app.post('/login', async (req, res) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: "User not found" });
    }
    if (user.password !== password ) {
        return res.status(400).json({ message: "Invalid credentails" });
    }

    //update lost login
    user.lastLogin = new Date();
    await user.save();

    res.json({
        message: "Login Scuccessful",
        user: {
            email: user.email,
            username: user.username
        }
    });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error"});
  }
});

// POST API to Save New Post
app.post("/postslist", async (req, res) => {
    try {
      const { userId, email, content, imageUrl } = req.body;
  
      if (!userId || !email || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const newPost = new Post({ userId, email, content, imageUrl });
      await newPost.save();
      
      res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

// API Route to add a sample user
app.post('/addsampleusers', async (req, res) => {
    console.log("Received body:", req.body);  // Debugging log

    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create and save the new user
        const newUser = new User({ email, password, username });
        await newUser.save();

        return res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//update profile image
app.put("/update-profile/:email", async (req, res) => {
    try {
        const { username, profileImage } = req.body;
        const { email } = req.params;

        const updateUser = await User.findOneAndUpdate(
            {email},
            {username, profileImage},
            {new: true } 

        );;

        if (!updateUser) {
            return res.status(400).json({ success: false, message: "User not found"});

        }
        res.json({ success: true, user: updateUser });

    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "server error"});
    }
})

app.get("/user/:email", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Ensure full image URL is sent
      const profileImage = user.profileImage
        ? user.profileImage
        : "http://localhost:4002/uploads/profile.jpg"; // Default image
  
      res.json({ success: true, user: { ...user.toObject(), profileImage } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

  app.post("/postscontent", async (req, res) => {
    try {

        const { email, postcontent, username, createdAt, imageUrl  } = req.body;
         console.log("Received Data:", req.body);
        // Validate request body
        if (!email || !postcontent || !username) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newPost = new Post({
            email,
            postcontent,
            username,
            createdAt: createdAt || new Date().toISOString(), // Default to current date
            imageUrl: imageUrl || "", // Default to empty string if no image
        });

        await newPost.save();
        res.json({ success: true, message: "Post saved successfully!" });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});



//// API Get post data
app.get('/getpostdetails', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all users from the database
        res.json(posts);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(4002, () => {
    console.log('app is running');
})