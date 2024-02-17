import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user alreday exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(500).json({ error: "User already exist" });
    }
    // Create a new user instance
    const newUser = new User({ username, email, password });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

    // Set the token in cookies
    res.cookie("accessToken", token, { httpOnly: true });

    // Redirect to the home page or send a success response
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const googleController = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "1y",
      });
      res.cookie("accessToken", token, { httpOnly: true });
      res.status(200).json(user);
    } else {
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);
      res.cookie("accessToken", token, { httpOnly: true });
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateDataController = async (req, res, next) => {
  try {
    let updateObj = { ...req.body };
    const findUser = await User.findById(req.userId);
    if (findUser.password !== req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      updateObj = { ...req.body, password: hash };
    }
    const updateData = await User.findByIdAndUpdate(req.userId, updateObj, {
      runValidators: true,
      new: true,
    });
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signOutController = (req, res) => {
  // Clear the 'accessToken' cookie
  res.clearCookie("accessToken");
  // Additional logic for sign-out, such as updating user state, etc.
  res.status(200).json({ message: "Sign-out successful" });
};

const verifyJWT = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err);
      } else {
        req.userId = decoded.userId;
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

const deleteController = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Remove user from MongoDB
    await User.findByIdAndDelete(userId);

    // Clear the accessToken cookie
    res.clearCookie("accessToken");

    // Send a success response
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  registerController,
  signinController,
  googleController,
  signOutController,
  updateDataController,
  verifyJWT,
  deleteController,
};
