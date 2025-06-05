# Wallet API App

This is a simple and minimal API implementation built to support testing based on the Swagger specification provided in the original task. Since the Swagger file pointed to a fake/non-existent server, this project (`wallet-api-app`) was created to simulate realistic wallet behaviors.

> ⚠️ **Note**: The implementation does not strictly follow the Swagger documentation but reflects practical assumptions of how a wallet API might behave. The goal was to provide a working base to test against — not to build a production-grade service.

The code was generated with **ChatGPT (GPT-4, June 2025)** based on prompts and guidance provided during development.

---

## 🧠 What’s Implemented

Below is a high-level summary of the core functionality:

- 🔐 JWT-based user authentication
- 👛 Wallet creation on first use (lazy creation)
- 💳 Credit and debit transactions
- 💰 Withdrawal handling with balance checks
- 📄 Transaction listing (with optional filtering and pagination)
- 🔍 Single transaction retrieval
- 🧪 Two mocked endpoints to simulate specific failure scenarios:

  - `/withdraw-failure`: always fails
  - `/pending-transaction`: responds as pending and then fails after timeout

---

## 👥 Test Users

Two hardcoded users can be used for testing authentication flows:

| Username | Password       |
| -------- | -------------- |
| ivana    | ikicaTest123!  |
| john     | !walletTest123 |

---

## 🚀 Getting Started

If you followed the **root README** instructions, you should already have the full `wallet-ivana-api-solution` project cloned. Now form there:

1. Change directory into the `wallet-api-app` folder:

   ```bash
   cd wallet-api-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   The following dependencies will be installed:

   | Package        | Purpose                                         |
   | -------------- | ----------------------------------------------- |
   | `express`      | Web server framework                            |
   | `uuid`         | To generate unique IDs for wallets/transactions |
   | `jsonwebtoken` | For issuing and verifying JWT tokens            |

3. Start the server:

   - Using Node.js directly:

     ```bash
     node server.js
     ```

   - Or using the provided script:

     ```bash
     npm run start:server
     ```

   By default, the server will start on [http://localhost:3000](http://localhost:3000).

   > You can change the port by editing the port constant at the top of the `server.js` file in the root of this folder.

---

## 📎 Additional Notes

This API was developed for testing purposes and does not follow any architectural, security, or scalability best practices. Its only intention is to work well enough for testing the frontend or automated tests in the `wallet-api-tests` project.

---
