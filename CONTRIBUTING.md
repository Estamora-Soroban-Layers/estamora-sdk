# Contributing to @estamora/sdk

Thank you for contributing to the Estamora TypeScript SDK! This package provides client abstractions, pre-flight simulation, and error decoding for Estamora contracts on Stellar.

## Getting Started

```bash
git clone https://github.com/Estamora-Soroban-Layers/estamora-sdk.git
cd estamora-sdk

# Install dependencies
npm install

# Run tests
npm test

# Typecheck and build
npm run typecheck
npm run build
```

## Guidelines

1. **Pre-flight Accuracy**: Simulations must replicate on-chain validation logic to catch transaction failures before submission.
2. **Type Safety**: Maintain strict TypeScript typing without using `any`.
3. **Error Handling**: All contract error codes must have corresponding definitions in `errors.ts`.
