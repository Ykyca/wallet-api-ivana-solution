export const validCreditTransaction = {
  currency: "EUR",
  amount: 10,
  type: "credit",
};

export const validDebitTransaction = {
  currency: "USD",
  amount: 50.75,
  type: "debit",
};

export const invalidTypeTransaction = {
  currency: "EUR",
  amount: 100.5,
  type: "invalidType",
};

export const negativeAmountDebitTransaction = {
  currency: "JPY",
  amount: -1,
  type: "debit",
};

export const zeroAmountCreditTransaction = {
  currency: "RSD",
  amount: 0,
  type: "credit",
};
