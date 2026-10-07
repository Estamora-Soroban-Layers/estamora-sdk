# @estamora/sdk

[![CI](https://github.com/Estamora-Soroban-Layers/estamora-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/Estamora-Soroban-Layers/estamora-sdk/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/badge/npm-v0.1.0-red.svg)](https://npmjs.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)

> **TypeScript SDK, zero-broadcast pre-flight simulation engine, and framework integration layer for the Estamora Payment Protocol on Stellar.**

Part of the **Estamora Payment Protocol**:
- 📜 **[estamora-contracts](https://github.com/Estamora-Soroban-Layers/estamora-contracts)** — Soroban smart contracts in Rust.
- ⚡ **[estamora-sdk](https://github.com/Estamora-Soroban-Layers/estamora-sdk)** — TypeScript client SDK (this repository).
- 💻 **[estamora-app](https://github.com/Estamora-Soroban-Layers/estamora-app)** — Merchant dashboard, checkout simulator, and Freighter operator console ([Live App](https://estamora-app.vercel.app)).
- 📚 **[estamora-docs](https://github.com/Estamora-Soroban-Layers/estamora-docs)** — Technical documentation hub ([Live Docs](https://estamora-docs.vercel.app)).

---

## 1. Installation

```bash
npm install @estamora/sdk @stellar/stellar-sdk
```

---

## 2. Quickstart

### Initialize the Client

```typescript
import { EstamoraClient } from "@estamora/sdk";

// Defaults to Stellar Testnet configuration
const client = new EstamoraClient();
```

### 1. Pre-Flight Simulation (Zero-Gas Inspection)

Simulate before prompting user wallet signatures to verify valid balances, timeouts, and authorization:

```typescript
const sim = await client.simulateCreateEscrow({
  buyer: "GCYDFWWJ6QN2CR3LLU42ZZBA3YFRXJ33I45GHUBD2VDJP3EVT4GXC354",
  seller: "GB3YBCFHYK4YWYKIMEWEHSMUBSOBEWWXGQR7UI3UEYB7X5IHBJL2Q3R4",
  token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC", // XLM or USDC
  amount: "10000000", // 1.0 XLM (in stroops)
  timeoutSeconds: 86400, // 24 hours
  memo: "Order #84920 Milestone Deposit",
});

if (!sim.success) {
  console.error("Simulation failed:", sim.errorMessage);
  return;
}

console.log(`Estimated fee: ${sim.minResourceFee} stroops`);
console.log(`CPU instructions: ${sim.cpuInstructions}`);
```

### 2. Delegated Payments for AI Agents & Services

Guard autonomous agents with on-chain daily spend limits:

```typescript
// Test if the agent's scheduled micropayment satisfies rolling caps:
const agentSim = await client.simulateDelegatedPay({
  delegate: "GD2KXUTFHTRJM7VQJRYV3FWWKMN6TNM6GPCLMQH74BZSQYEKYR64QJFH", // Agent public key
  owner: "GCYDFWWJ6QN2CR3LLU42ZZBA3YFRXJ33I45GHUBD2VDJP3EVT4GXC354",    // Account owner
  recipient: "GB3YBCFHYK4YWYKIMEWEHSMUBSOBEWWXGQR7UI3UEYB7X5IHBJL2Q3R4",
  token: "CBLQLJAG72M4XQRJMQHSKYIFVHQD7LNTNOQH2GRMCMBWMSLBSLTGTJC7",     // USDC
  amount: "5000000", // 0.5 USDC
});

if (agentSim.success) {
  console.log("Agent payment approved under current rolling cap!");
}
```

### 3. Error Decoding

Decode Soroban numeric error codes into human-readable diagnostics and recovery instructions:

```typescript
import { decodeErrorCode } from "@estamora/sdk";

const error = decodeErrorCode(10);
console.log(error.mnemonic); // "PER_TX_CAP_EXCEEDED"
console.log(error.message);  // "Transaction amount exceeds authorized per-transaction spend limit."
console.log(error.recovery); // "Reduce payment amount or request an increase in per-transaction cap."
```

---

## 3. Error Catalog Reference

| Code | Mnemonic | Description | Recovery |
| :---: | :--- | :--- | :--- |
| `1` | `NOT_INITIALIZED` | Contract uninitialized | Deployer must run `initialize(admin)`. |
| `2` | `ALREADY_INITIALIZED` | Re-initialization rejected | Contract is immutable once initialized. |
| `3` | `UNAUTHORIZED` | Caller lacked authorization | Use authorized signer key. |
| `4` | `INVALID_AMOUNT` | Amount <= 0 | Specify positive non-zero amount. |
| `5` | `INVALID_TIMEOUT` | Timeout duration is 0 | Specify positive duration in seconds. |
| `6` | `ESCROW_NOT_FOUND` | Escrow ID not found | Verify escrow ID from receipt. |
| `7` | `ESCROW_NOT_PENDING` | Escrow already finalized | Check current escrow state. |
| `8` | `TIMEOUT_NOT_EXPIRED` | Refund requested early | Wait for ledger timestamp to exceed timeout. |
| `9` | `SPEND_CAP_NOT_FOUND` | No active spend limit found | Owner must call `register_spend_cap`. |
| `10` | `PER_TX_CAP_EXCEEDED`| Amount > per-tx cap | Lower amount or raise per-tx limit. |
| `11` | `DAILY_CAP_EXCEEDED` | Exceeds 24h rolling cap | Wait for window reset or raise daily limit. |
| `12` | `SPEND_CAP_REVOKED`  | Spend delegation disabled | Re-register spend cap. |
| `13` | `INVALID_SPLIT_PERCENTAGE` | Split != 100% | Ensure `buyer_pct + seller_pct == 100`. |
| `14` | `ESCROW_NOT_DISPUTED`| Dispute action required | Flag as disputed before arbitration. |

---

## 4. Testing

```bash
npm test
```

```text
▶ EstamoraClient SDK
  ✔ initializes with default testnet configuration
  ✔ allows custom network configuration overrides
  ✔ simulates valid escrow creation parameters
  ✔ rejects invalid amounts during pre-flight simulation
  ✔ rejects invalid timeout seconds during pre-flight simulation
  ✔ simulates delegated payment pre-flight check
  ✔ decodes contract error codes accurately
  ✔ has exactly 14 defined structured error codes
✔ EstamoraClient SDK (8 passed; 0 failed)
```

---

## 5. Community & Contributions

- 💬 **Telegram**: [Estamora Community](https://t.me/estamora_stellar)
- 👾 **Discord**: [Estamora Developers](https://discord.gg/estamora-dev)
- 👤 **Maintainer**: [@winningtalker-commits](https://github.com/winningtalker-commits)

---

## 6. License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
