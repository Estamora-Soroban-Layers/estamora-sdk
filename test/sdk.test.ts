import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EstamoraClient, decodeErrorCode, ERROR_CATALOG, TESTNET_CONFIG } from "../src/index.js";

const BUYER = "GCYDFWWJ6QN2CR3LLU42ZZBA3YFRXJ33I45GHUBD2VDJP3EVT4GXC354";
const SELLER = "GB3YBCFHYK4YWYKIMEWEHSMUBSOBEWWXGQR7UI3UEYB7X5IHBJL2Q3R4";
const AGENT = "GD2KXUTFHTRJM7VQJRYV3FWWKMN6TNM6GPCLMQH74BZSQYEKYR64QJFH";
const TOKEN = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

describe("EstamoraClient SDK", () => {
  const client = new EstamoraClient();

  it("initializes with default testnet configuration", () => {
    assert.equal(client.config.contractId, TESTNET_CONFIG.contractId);
    assert.equal(client.config.rpcUrl, "https://soroban-testnet.stellar.org");
    assert.ok(client.contract);
  });

  it("allows custom network configuration overrides", () => {
    const customContract = "CAYJZT4XH5SWDXNR7MZJCCUBIDAT2KZDDUTZ7OZQEMKCPJGD4P3X4CU7";
    const custom = new EstamoraClient({
      contractId: customContract,
    });
    assert.equal(custom.config.contractId, customContract);
  });

  it("simulates valid escrow creation parameters", async () => {
    const sim = await client.simulateCreateEscrow({
      buyer: BUYER,
      seller: SELLER,
      token: TOKEN,
      amount: "10000000",
      timeoutSeconds: 86400,
      memo: "E-commerce Milestone 1",
    });

    assert.equal(sim.success, true);
    assert.ok(BigInt(sim.minResourceFee) > 0n);
    assert.ok(sim.cpuInstructions && sim.cpuInstructions > 0);
  });

  it("rejects invalid amounts during pre-flight simulation", async () => {
    const sim = await client.simulateCreateEscrow({
      buyer: BUYER,
      seller: SELLER,
      token: TOKEN,
      amount: "0",
      timeoutSeconds: 3600,
      memo: "Zero Amount",
    });

    assert.equal(sim.success, false);
    assert.equal(sim.errorCode, 4);
    assert.equal(sim.errorMessage, "Payment or escrow amount must be strictly greater than 0.");
  });

  it("rejects invalid timeout seconds during pre-flight simulation", async () => {
    const sim = await client.simulateCreateEscrow({
      buyer: BUYER,
      seller: SELLER,
      token: TOKEN,
      amount: "500000",
      timeoutSeconds: 0,
      memo: "Invalid Timeout",
    });

    assert.equal(sim.success, false);
    assert.equal(sim.errorCode, 5);
    assert.equal(sim.errorMessage, "Escrow timeout seconds must be greater than 0.");
  });

  it("simulates delegated payment pre-flight check", async () => {
    const sim = await client.simulateDelegatedPay({
      delegate: AGENT,
      owner: BUYER,
      recipient: SELLER,
      token: TOKEN,
      amount: "25000000",
    });

    assert.equal(sim.success, true);
    assert.ok(sim.authRequired?.includes(AGENT));
  });

  it("decodes contract error codes accurately", () => {
    const notInit = decodeErrorCode(1);
    assert.equal(notInit.mnemonic, "NOT_INITIALIZED");

    const perTx = decodeErrorCode(10);
    assert.equal(perTx.mnemonic, "PER_TX_CAP_EXCEEDED");
    assert.ok(perTx.recovery.length > 0);

    const unknown = decodeErrorCode(999);
    assert.equal(unknown.mnemonic, "UNKNOWN_ERROR");
  });

  it("has exactly 14 defined structured error codes", () => {
    assert.equal(Object.keys(ERROR_CATALOG).length, 14);
  });
});
