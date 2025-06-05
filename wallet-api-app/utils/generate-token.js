const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    sub: user.userId,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
  const refreshToken = jwt.sign({ ...payload, scope: "refresh" }, "secret", {
    expiresIn: "7d",
  });

  const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return { token, refreshToken, expiry };
}

module.exports = { generateToken };
