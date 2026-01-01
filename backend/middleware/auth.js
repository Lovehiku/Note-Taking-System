const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.authenticate = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find user
    const foundUser = await User.findById(decoded.id).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    // 5. Attach user to request
    req.user = foundUser;

    next(); // ✅ allow access
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
