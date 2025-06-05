const express = require("express");
const router = express.Router();
const { users } = require("../data/memory");
const { generateToken } = require("../utils/generate-token");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const serviceId = req.header("X-Service-Id");

  if (!serviceId)
    return res.status(400).json({ message: "Missing X-Service-Id header" });

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const tokens = generateToken(user);
  res.json({ ...tokens, userId: user.userId });
});

module.exports = router;
// This route handles user login, checks credentials, and returns JWT tokens if successful.
