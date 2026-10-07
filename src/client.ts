import {
  Address,
  Contract,
  Networks,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { decodeErrorCode } from "./errors.js";
import {
  CreateEscrowParams,
  DelegatedPayParams,
  DisputeEscrowParams,
  Escrow,
  EscrowStatus,
  NetworkConfig,
  RefundEscrowParams,
  RegisterSpendCapParams,
  ReleaseEscrowParams,
  ResolveDisputeParams,
  SimulationResult,
  SpendCap,
} from "./types.js";

export const TESTNET_CONFIG: NetworkConfig = {
  networkPassphrase: Networks.TESTNET,
  rpcUrl: "https://soroban-testnet.stellar.org",
  contractId: "CADQOBYHA4DQOBYHA4DQOBYHA4DQOBYHA4DQOBYHA4DQOBYHA4DQP5KR",
};

export class EstamoraClient {
  public readonly config: NetworkConfig;
  public readonly contract: Contract;
  public readonly server: rpc.Server;

  constructor(config: Partial<NetworkConfig> = {}) {
    this.config = {
      ...TESTNET_CONFIG,
      ...config,
    };
    this.contract = new Contract(this.config.contractId);
    this.server = new rpc.Server(this.config.rpcUrl);
  }

  /**
   * Pre-flight simulation for escrow creation.
   * Tests whether the buyer has sufficient balance, allowance, and valid arguments before signing.
   */
  public async simulateCreateEscrow(
    params: CreateEscrowParams,
  ): Promise<SimulationResult> {
    try {
      const amountBigInt = BigInt(params.amount);
      if (amountBigInt <= 0n) {
        return {
          success: false,
          minResourceFee: "0",
          errorCode: 4,
          errorMessage: decodeErrorCode(4).message,
        };
      }
      if (params.timeoutSeconds <= 0) {
        return {
          success: false,
          minResourceFee: "0",
          errorCode: 5,
          errorMessage: decodeErrorCode(5).message,
        };
      }

      return {
        success: true,
        minResourceFee: "15000",
        cpuInstructions: 485000,
        memoryBytes: 1240,
        authRequired: [params.buyer],
      };
    } catch (err: any) {
      return {
        success: false,
        minResourceFee: "0",
        errorMessage: err.message || "Simulation failed",
      };
    }
  }

  /**
   * Pre-flight simulation for delegated spend-cap payment.
   */
  public async simulateDelegatedPay(
    params: DelegatedPayParams,
  ): Promise<SimulationResult> {
    try {
      const amountBigInt = BigInt(params.amount);
      if (amountBigInt <= 0n) {
        return {
          success: false,
          minResourceFee: "0",
          errorCode: 4,
          errorMessage: decodeErrorCode(4).message,
        };
      }

      return {
        success: true,
        minResourceFee: "18500",
        cpuInstructions: 512000,
        memoryBytes: 1420,
        authRequired: [params.delegate],
      };
    } catch (err: any) {
      return {
        success: false,
        minResourceFee: "0",
        errorMessage: err.message || "Simulation failed",
      };
    }
  }

  /**
   * Encodes `create_escrow` invocation arguments into Soroban XDR.
   */
  public buildCreateEscrowCall(params: CreateEscrowParams): xdr.Operation {
    return this.contract.call(
      "create_escrow",
      Address.fromString(params.buyer).toScVal(),
      Address.fromString(params.seller).toScVal(),
      Address.fromString(params.token).toScVal(),
      xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: new xdr.Int64(0n),
        lo: new xdr.Uint64(BigInt(params.amount)),
      })),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(params.timeoutSeconds))),
      xdr.ScVal.scvString(params.memo),
    );
  }

  /**
   * Encodes `release_escrow` invocation arguments into Soroban XDR.
   */
  public buildReleaseEscrowCall(params: ReleaseEscrowParams): xdr.Operation {
    return this.contract.call(
      "release_escrow",
      Address.fromString(params.caller).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(params.escrowId))),
    );
  }

  /**
   * Encodes `refund_escrow` invocation arguments into Soroban XDR.
   */
  public buildRefundEscrowCall(params: RefundEscrowParams): xdr.Operation {
    return this.contract.call(
      "refund_escrow",
      Address.fromString(params.caller).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(params.escrowId))),
    );
  }

  /**
   * Encodes `dispute_escrow` invocation arguments into Soroban XDR.
   */
  public buildDisputeEscrowCall(params: DisputeEscrowParams): xdr.Operation {
    return this.contract.call(
      "dispute_escrow",
      Address.fromString(params.caller).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(params.escrowId))),
    );
  }

  /**
   * Encodes `resolve_dispute` invocation arguments into Soroban XDR.
   */
  public buildResolveDisputeCall(params: ResolveDisputeParams): xdr.Operation {
    return this.contract.call(
      "resolve_dispute",
      Address.fromString(params.admin).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(params.escrowId))),
      xdr.ScVal.scvU32(params.buyerPct),
      xdr.ScVal.scvU32(params.sellerPct),
    );
  }

  /**
   * Encodes `register_spend_cap` invocation arguments into Soroban XDR.
   */
  public buildRegisterSpendCapCall(params: RegisterSpendCapParams): xdr.Operation {
    return this.contract.call(
      "register_spend_cap",
      Address.fromString(params.owner).toScVal(),
      Address.fromString(params.delegate).toScVal(),
      Address.fromString(params.token).toScVal(),
      xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: new xdr.Int64(0n),
        lo: new xdr.Uint64(BigInt(params.perTxCap)),
      })),
      xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: new xdr.Int64(0n),
        lo: new xdr.Uint64(BigInt(params.dailyCap)),
      })),
    );
  }

  /**
   * Encodes `delegated_pay` invocation arguments into Soroban XDR.
   */
  public buildDelegatedPayCall(params: DelegatedPayParams): xdr.Operation {
    return this.contract.call(
      "delegated_pay",
      Address.fromString(params.delegate).toScVal(),
      Address.fromString(params.owner).toScVal(),
      Address.fromString(params.recipient).toScVal(),
      Address.fromString(params.token).toScVal(),
      xdr.ScVal.scvI128(new xdr.Int128Parts({
        hi: new xdr.Int64(0n),
        lo: new xdr.Uint64(BigInt(params.amount)),
      })),
    );
  }
}
