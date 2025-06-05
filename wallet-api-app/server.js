const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const walletRoutes = require("./routes/wallet");

app.use("/user", authRoutes);
app.use("/user", userRoutes);
app.use("/wallet", walletRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
