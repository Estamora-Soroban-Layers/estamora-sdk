export enum EscrowStatus {
  Pending = 0,
  Released = 1,
  Refunded = 2,
  Disputed = 3,
  Resolved = 4,
}

export interface Escrow {
  id: number;
  buyer: string;
  seller: string;
  token: string;
  amount: bigint;
  createdAt: number;
  timeoutTimestamp: number;
  status: EscrowStatus;
  memo: string;
}

export interface SpendCap {
  owner: string;
  delegate: string;
  token: string;
  perTxCap: bigint;
  dailyCap: bigint;
  windowStart: number;
  spentInWindow: bigint;
  active: boolean;
}

export interface CreateEscrowParams {
  buyer: string;
  seller: string;
  token: string;
  amount: bigint | string | number;
  timeoutSeconds: number;
  memo: string;
}

export interface ReleaseEscrowParams {
  caller: string;
  escrowId: number;
}

export interface RefundEscrowParams {
  caller: string;
  escrowId: number;
}

export interface DisputeEscrowParams {
  caller: string;
  escrowId: number;
}

export interface ResolveDisputeParams {
  admin: string;
  escrowId: number;
  buyerPct: number;
  sellerPct: number;
}

export interface RegisterSpendCapParams {
  owner: string;
  delegate: string;
  token: string;
  perTxCap: bigint | string | number;
  dailyCap: bigint | string | number;
}

export interface DelegatedPayParams {
  delegate: string;
  owner: string;
  recipient: string;
  token: string;
  amount: bigint | string | number;
}

export interface SimulationResult {
  success: boolean;
  minResourceFee: string;
  cpuInstructions?: number;
  memoryBytes?: number;
  authRequired?: string[];
  errorCode?: number;
  errorMessage?: string;
}

export interface NetworkConfig {
  networkPassphrase: string;
  rpcUrl: string;
  contractId: string;
}
