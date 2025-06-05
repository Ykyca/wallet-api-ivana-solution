const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { users, wallets } = require("../data/memory");

router.get("/info/:userId", authenticateToken, (req, res) => {
  const user = users.find((u) => u.userId === req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!wallets[user.userId]) {
    wallets[user.userId] = {
      walletId: user.userId,
      currencyClips: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  res.json({
    walletId: user.userId,
    name: user.name,
    locale: user.locale,
    region: user.region,
    timezone: user.timezone,
    email: user.email,
  });
});

module.exports = router;
