const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and generate an OTP
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if a user with that email already exists
    let user = await User.findOne({ email });
    if (user) {
      // To prevent user enumeration, you might want to send a generic message
      // even if the user exists, but for development, this is fine.
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      password,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    // Set OTP to expire in 10 minutes
    user.otpExpires = Date.now() + 10 * 60 * 1000; 

    // Save the unverified user to the database
    await user.save();

    // Log the OTP for development/testing purposes
    // In a real application, you would send this via email or SMS.
    console.log(`OTP for ${email}: ${otp}`);

    // Send a success response
    res.status(201).json({
      msg: 'User registered successfully. Please verify your account using the OTP.',
      userId: user.id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & generate OTP for 2FA
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    // Check for user by email
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      // Use a generic message for security to prevent email enumeration
      // We also check for verification here. If not verified, they can't log in.
      return res.status(400).json({ msg: 'Invalid credentials or user not verified' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If credentials are correct, generate a new OTP for this login attempt
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Log OTP for development
    console.log(`Login OTP for ${email}: ${otp}`);

    // Send success response, indicating OTP step is next
    res.status(200).json({ msg: 'Authentication successful. Please enter the OTP to complete login.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP for registration or login and return JWT
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: 'Please provide email and OTP' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Generic message for security
      return res.status(400).json({ msg: 'Invalid OTP or email' });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP. Please try again.' });
    }

    // If it's a new user signing up, mark them as verified
    if (!user.isVerified) {
      user.isVerified = true;
    }

    // Clear the OTP fields after successful verification to prevent reuse
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the token and send it back
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
