// Dummy auth middleware - only checks for token presence
module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }
  // Skipping real token verification as per assignment
  next();
};
