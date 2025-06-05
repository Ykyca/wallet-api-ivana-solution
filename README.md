# Wallet API Solution

This is my solution to the assigned task. Since the provided Swagger file did not point to a real server and was fake, I decided to implement a simple API based on the specs from that file. The API project is called **wallet-api-app**.

> ⚠️ Note: The implementation is not 100% aligned with the Swagger documentation, but it follows reasonable assumptions about how a wallet system should work.

The code was written with the help of **ChatGPT (GPT-4, June 2025)** under my guidance and through a series of prompts and iterations.

Another folder in this project is called **wallet-api-tests**, and it is a Cypress project used to test the API.

To run the tests, you must first start the server from the `wallet-api-app` folder.

For detailed setup and usage instructions, please refer to the `README.md` files within the two subfolders. The order is important- first visit the one in the wallet-api-app and then continue to wallet-api-tests.

---

Sure! Here’s a simple **Cloning the Repository** section you can add to the root README:

---

## Cloning the Repository

If you haven’t cloned the project yet, run the following command to clone it locally:

```bash
git clone https://github.com/Ykyca/wallet-api-ivana-solution.git
```

This will create a folder named `wallet-api-ivana-solution` containing the full project with both `wallet-api-app` and `wallet-api-tests` subfolders.

---

## Setup Prerequisites

Before running the API or tests, make sure you have the following installed:

- **Node.js**: `v22.14.0`
- **npm**: `v10.9.2`

You can check your installed versions by running:

```bash
node -v
npm -v
```
