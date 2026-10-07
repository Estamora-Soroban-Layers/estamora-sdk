# Changelog

All notable changes to `@estamora/sdk` are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-07

### Added
- **EstamoraClient Core**:
  - Full TypeScript client interface connecting to Stellar Testnet RPC and Horizon.
  - Default contract target: `CADQOBYHA4DQOBYHA4DQOBYHA4DQOBYHA4DQOBYHA4DQP5KR`.
- **Pre-flight Simulation Engine**:
  - `simulateCreateEscrow`: Validates amounts, expiration times, address formats, and simulates fee/gas bounds before submitting transactions.
  - `simulateDelegatedPayment`: Validates spend allowance parameters and rolling window limits.
- **Contract Error Decoder**:
  - 14 structured contract error codes mapped to typed JavaScript errors (`ContractErrorCode`).
- **Transaction Assembly**:
  - Parameter encoding for `create_escrow`, `release_milestone`, `refund_escrow`, `open_dispute`, `resolve_dispute`, `set_spend_cap`, and `execute_delegated_payment`.
- **Unit & Integration Test Suite**:
  - 8 passing test cases for validation, error decoding, and client options.
