const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../email_verification/controller");
const User = require("./model");


// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    let { gamerTag, email, password } = req.body;
    gamerTag = gamerTag.trim();
    email = email.trim();
    password = password.trim();

    if (!(gamerTag && email && password)) {
      throw Error("Empty input fields!");
    } else if (!/^[a-zA-Z ]*$/.test(gamerTag)) {
      throw Error("Invalid gamerTag entered");
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered");
    } else if (password.length < 8) {
      throw Error("Password is too short!");
    } else {
      // good credentials, create new user

      const newUser = await createNewUser({
        gamerTag,
        email,
        password,
      });

      await sendVerificationOTPEmail(email);

      res.status(201).json(newUser);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Signin
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if gamer tag and password are empty
    if (!trimmedEmail || !trimmedPassword) {
      throw Error("Empty credentials supplied!");
    }

    const authenticatedUser = await authenticateUser({ email, password });

    res.status(200).json(authenticatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }

});



// Logout
router.post('/logout', (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' // Set secure flag based on environment
    });

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during logout.' });
  }
});


    


// protected route
router.get("/private_data", auth, (req, res) => {
  res.status(200).send("You're in a private territory");
});

module.exports = router;
