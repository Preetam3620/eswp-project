const User = require("../models/user");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  // Check if authentication is disabled via environment variable
  if (process.env.DISABLE_AUTH === "true") {
    // Mock authenticated user for development/testing
    req.user = {
      userId: "674cab386076863bc1df7d0f",
      email: "admin@example.com",
      role: "superadmin",
      branch: "defaultBranch",
    };
    return next(); // Skip token validation
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError.UnauthenticatedError("Invalid Authentication");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      branch: payload.branch,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Invalid Authentication");
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Bypass role checking if authentication is disabled
    if (process.env.DISABLE_AUTH === "true") {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
};