const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const authenticateToken = require("../middleware/auth");
const { wallets, transactions } = require("../data/memory");

// Helper to get or create a wallet
function getOrCreateWallet(walletId) {
  if (!wallets[walletId]) {
    wallets[walletId] = {
      walletId,
      currencyClips: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return wallets[walletId];
}

// GET /wallet/:walletId
router.get("/:walletId", authenticateToken, (req, res) => {
  const wallet = getOrCreateWallet(req.params.walletId);
  res.json(wallet);
});

// POST /wallet/:walletId/transaction
router.post("/:walletId/transaction", authenticateToken, (req, res) => {
  let { currency, amount, type } = req.body;
  currency = typeof currency === "string" ? currency.toUpperCase() : currency;
  const walletId = req.params.walletId;
  const wallet = getOrCreateWallet(walletId);

  // Validate input
  if (!currency || typeof currency !== "string" || currency.length !== 3) {
    return res.status(400).json({ message: "Invalid currency format." });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number." });
  }
  if (!["credit", "debit"].includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type." });
  }

  const now = new Date().toISOString();
  const clip = wallet.currencyClips.find((c) => c.currency === currency);
  let status = "finished";
  let outcome = "approved";

  if (type === "credit") {
    if (clip) {
      clip.balance += amount;
      clip.transactionCount += 1;
      clip.lastTransaction = now;
    } else {
      wallet.currencyClips.push({
        currency,
        balance: amount,
        lastTransaction: now,
        transactionCount: 1,
      });
    }
  } else if (type === "debit") {
    if (!clip || clip.balance < amount) {
      outcome = "denied";
    } else {
      clip.balance -= amount;
      clip.transactionCount += 1;
      clip.lastTransaction = now;
    }
  }

  wallet.updatedAt = now;

  const transactionId = uuidv4();
  const transaction = {
    transactionId,
    currency,
    amount,
    type,
    status,
    outcome,
    createdAt: now,
    updatedAt: now,
  };

  // Store transaction
  if (!transactions[walletId]) transactions[walletId] = [];
  transactions[walletId].push(transaction);

  res.status(201).json(transaction);
});

// POST /wallet/:walletId/withdraw
router.post("/:walletId/withdraw", authenticateToken, (req, res) => {
  let { currency, amount } = req.body;
  currency = typeof currency === "string" ? currency.toUpperCase() : currency;
  const walletId = req.params.walletId;
  const wallet = getOrCreateWallet(walletId);

  // Validate input
  if (!currency || typeof currency !== "string" || currency.length !== 3) {
    return res.status(400).json({ message: "Invalid currency format." });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number." });
  }

  const clip = wallet.currencyClips.find((c) => c.currency === currency);
  const now = new Date().toISOString();
  let status = "finished";
  let outcome = "approved";

  if (!clip || clip.balance < amount) {
    outcome = "denied";
  } else {
    clip.balance -= amount;
    clip.transactionCount += 1;
    clip.lastTransaction = now;
  }

  wallet.updatedAt = now;

  const transactionId = uuidv4();
  const transaction = {
    transactionId,
    currency,
    amount,
    type: "debit",
    status,
    outcome,
    createdAt: now,
    updatedAt: now,
  };

  if (!transactions[walletId]) transactions[walletId] = [];
  transactions[walletId].push(transaction);

  // Calculate new balance (0 if clip missing)
  const newBalance = clip ? clip.balance : 0;

  // Always include newBalance in response
  if (outcome === "denied") {
    return res.status(400).json({
      message: "Insufficient funds.",
      transaction,
      newBalance,
    });
  }

  res.status(201).json({
    transaction,
    newBalance,
  });
});

// GET /wallet/:walletId/transaction/:transactionId
router.get(
  "/:walletId/transaction/:transactionId",
  authenticateToken,
  (req, res) => {
    const { walletId, transactionId } = req.params;
    const txList = transactions[walletId] || [];
    const tx = txList.find((t) => t.transactionId === transactionId);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    res.json(tx);
  }
);

// GET /wallet/:walletId/transactions
router.get("/:walletId/transactions", authenticateToken, (req, res) => {
  const { walletId } = req.params;
  const { page = 1, startDate, endDate } = req.query;

  let txList = transactions[walletId] || [];

  if (startDate) {
    const start = new Date(startDate);
    txList = txList.filter((tx) => new Date(tx.createdAt) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    txList = txList.filter((tx) => new Date(tx.createdAt) <= end);
  }

  const pageSize = 10;
  const totalCount = txList.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginated = txList.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    transactions: paginated,
    totalCount,
    currentPage: Number(page),
    totalPages,
  });
});

// Mocking route for auto-denial
router.post("/:id/withdraw-failure", (req, res) => {
  return res.status(403).json({
    approved: false,
    reason: "Transaction denied: Daily limit exceeded",
  });
});

// Mockin route for pending transaction which becomes denied after 15 seconds
router.post("/:id/pending-transaction", (req, res) => {
  const walletId = req.params.id;
  const { currency, amount, type } = req.body;
  const now = new Date();

  if (!transactions[walletId]) transactions[walletId] = [];

  let existingTx = transactions[walletId].find(
    (tx) =>
      tx.status === "pending" &&
      tx.currency === currency &&
      tx.amount === amount &&
      tx.type === type
  );

  if (existingTx) {
    const createdAt = new Date(existingTx.createdAt);
    const secondsPassed = (now - createdAt) / 1000;
    if (secondsPassed > 15) {
      existingTx.status = "finished";
      existingTx.outcome = "denied";
      existingTx.updatedAt = now.toISOString();
      return res.status(403).json(existingTx);
    }
    return res.status(202).json(existingTx);
  }

  // Create new pending transaction
  const newTx = {
    transactionId: uuidv4(),
    currency,
    amount,
    type,
    status: "pending",
    outcome: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  transactions[walletId].push(newTx);

  return res.status(201).json(newTx);
});

module.exports = router;
// This module defines routes for wallet operations
