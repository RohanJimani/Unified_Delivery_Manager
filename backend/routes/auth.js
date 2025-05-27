const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer"); // ✅ Required to use multer
const path = require("path");
const User = require("../models/User");
const LoginLog = require("../models/Login"); // ✅ Check the path is correct

const router = express.Router();

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Unique filename
  },
});

const upload = multer({ storage: storage });

/*
🟡 Now your form should send the photo file as 'photo' field name using multipart/form-data
Example: <input type="file" name="photo" />
*/

// ✅ Register route with Multer middleware
router.post("/register", upload.single("photo"), async (req, res) => {
  const { name, email, password, aadhar, address, phone } = req.body;
  const photo = req.file ? req.file.filename : ""; // multer stores filename in req.file

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      aadhar,
      address,
      photo,
      phone,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// // Register a new user
// router.post("/register", async (req, res) => {
//   const { name, email, password, aadhar, address, photo, phone } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//         name,
//         email,
//         password: hashedPassword,
//         aadhar,
//         address,
//         photo: photo?.toString?.() || "", // <-- FIX here
//         phone,
// });


//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });



// Login a user
// router.post("/login", async (req, res) => {
//   try {
//     let { email, password } = req.body;
//     console.log("Login Request Body:", req.body);

//     email = email?.toLowerCase()?.trim();
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found for email:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Incorrect password for:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

    

// //     const loginData = {
// //   userId: user._id,
// //   email: user.email,
// //   ip: req.ip || req.headers["x-forwarded-for"] || "", 
// //   userAgent: req.headers["user-agent"],
// // };


// // const loginData = {
// //   userId: new mongoose.Types.ObjectId(user._id),
// //   email: user.email,
// //   ip: req.ip || req.headers["x-forwarded-for"] || "",
// //   userAgent: req.headers["user-agent"],
// // };

// // console.log("🧾 Login Log Payload:", loginData);

// try {
//    const savedLog = await LoginLog.create(loginData);
//    console.log("✅ Login log saved to DB:", savedLog);
//   // await LoginLog.create(loginData);
//   // console.log("✅ Login log saved to DB");
// } catch (err) {
//   console.error("❌ Login log save error:", err);
// }


   


//     const { password: pw, ...userWithoutPassword } = user.toObject();
//     res.status(200).json({ message: "Login successful", user: userWithoutPassword });
//   } catch (error) {
//     console.error("Login Error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });


// Login a user
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Login Request Body:", req.body);

    email = email?.toLowerCase()?.trim();
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Define loginData here
    const loginData = {
      userId: user._id,
      email: user.email,
      ip: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    };

    try {
      await LoginLog.create(loginData);
      console.log("✅ Login log saved to DB");
    } catch (err) {
      console.error("❌ Login log save error:", err);
    }

    const { password: pw, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router; // Ensure this is exported correctly