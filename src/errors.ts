export interface ErrorDefinition {
  code: number;
  mnemonic: string;
  message: string;
  recovery: string;
}

export const ERROR_CATALOG: Record<number, ErrorDefinition> = {
  1: {
    code: 1,
    mnemonic: "NOT_INITIALIZED",
    message: "Contract has not been initialized with an admin address.",
    recovery: "Deployer must invoke initialize(admin) first.",
  },
  2: {
    code: 2,
    mnemonic: "ALREADY_INITIALIZED",
    message: "Contract is already initialized.",
    recovery: "Do not attempt to re-initialize.",
  },
  3: {
    code: 3,
    mnemonic: "UNAUTHORIZED",
    message: "Caller is not authorized to perform this operation.",
    recovery: "Ensure you are using the correct signing key (buyer, seller, or admin).",
  },
  4: {
    code: 4,
    mnemonic: "INVALID_AMOUNT",
    message: "Payment or escrow amount must be strictly greater than 0.",
    recovery: "Specify a positive token amount.",
  },
  5: {
    code: 5,
    mnemonic: "INVALID_TIMEOUT",
    message: "Escrow timeout seconds must be greater than 0.",
    recovery: "Specify a future timeout duration in seconds.",
  },
  6: {
    code: 6,
    mnemonic: "ESCROW_NOT_FOUND",
    message: "The requested escrow ID does not exist in ledger storage.",
    recovery: "Verify the escrow ID.",
  },
  7: {
    code: 7,
    mnemonic: "ESCROW_NOT_PENDING",
    message: "The escrow is no longer in pending status (already released, refunded, or disputed).",
    recovery: "Check the current escrow status before taking action.",
  },
  8: {
    code: 8,
    mnemonic: "TIMEOUT_NOT_EXPIRED",
    message: "Cannot claim timeout refund before the escrow timeout timestamp has passed.",
    recovery: "Wait until the timeout expires, or request an explicit refund from the seller.",
  },
  9: {
    code: 9,
    mnemonic: "SPEND_CAP_NOT_FOUND",
    message: "No active spend cap registered for this (owner, delegate, token) tuple.",
    recovery: "The owner must invoke register_spend_cap() first.",
  },
  10: {
    code: 10,
    mnemonic: "PER_TX_CAP_EXCEEDED",
    message: "Transaction amount exceeds the authorized per-transaction spend limit.",
    recovery: "Reduce payment amount or request an increase in per-transaction cap.",
  },
  11: {
    code: 11,
    mnemonic: "DAILY_CAP_EXCEEDED",
    message: "Cumulative spend within the 24-hour rolling window exceeds authorized daily limit.",
    recovery: "Wait for the 24-hour window to reset or request a daily limit increase.",
  },
  12: {
    code: 12,
    mnemonic: "SPEND_CAP_REVOKED",
    message: "Spend cap has been revoked by the account owner.",
    recovery: "Account owner must re-register spend cap.",
  },
  13: {
    code: 13,
    mnemonic: "INVALID_SPLIT_PERCENTAGE",
    message: "Dispute split percentages must sum exactly to 100%.",
    recovery: "Ensure buyer_pct + seller_pct == 100.",
  },
  14: {
    code: 14,
    mnemonic: "ESCROW_NOT_DISPUTED",
    message: "Escrow must be flagged as disputed before admin arbitration.",
    recovery: "Buyer or seller must invoke dispute_escrow() first.",
  },
};

export function decodeErrorCode(code: number): ErrorDefinition {
  return (
    ERROR_CATALOG[code] || {
      code,
      mnemonic: "UNKNOWN_ERROR",
      message: `Unknown contract error code: ${code}`,
      recovery: "Inspect raw simulation and ledger error traces.",
    }
  );
}
