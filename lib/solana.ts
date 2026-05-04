import crypto from "crypto";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  AccountMeta,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";

function getEarnPointsDiscriminator(): Buffer {
  return Buffer.from(
    crypto.createHash("sha256").update("global:earn_points").digest(),
  ).subarray(0, 8);
}

function decodeSignerKeypair(raw: string): Keypair {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    const bytes = JSON.parse(trimmed) as number[];
    return Keypair.fromSecretKey(Uint8Array.from(bytes));
  }
  // base58 — 32 bytes = seed only, 64 bytes = full keypair
  const decoded = bs58.decode(trimmed);
  return decoded.length === 32
    ? Keypair.fromSeed(decoded)
    : Keypair.fromSecretKey(decoded);
}

export async function earnPointsOnChain(
  userWalletAddress: string,
  spendAmountIdr: number,
): Promise<string> {
  console.log(
    "Earning points on-chain for wallet",
    userWalletAddress,
    "spend amount (IDR)",
    spendAmountIdr,
  );
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const programIdRaw = process.env.NEXT_PUBLIC_PROGRAM_ID;
  const merchantPrivKey = process.env.MERCHANT_PRIVATE_KEY;
  const merchantPubKeyRaw = process.env.MERCHANT_PUBLIC_KEY;
  const pointsMintRaw = process.env.MERCHANT_POINTS_MINT;

  if (
    !rpcUrl ||
    !programIdRaw ||
    !merchantPrivKey ||
    !merchantPubKeyRaw ||
    !pointsMintRaw
  ) {
    throw new Error(
      "Missing Solana env vars: SOLANA_RPC_URL, NEXT_PUBLIC_PROGRAM_ID, MERCHANT_PRIVATE_KEY, MERCHANT_PUBLIC_KEY, MERCHANT_POINTS_MINT",
    );
  }

  const programId = new PublicKey(programIdRaw);
  const pointsMint = new PublicKey(pointsMintRaw);
  // Public key is used for PDA derivation and account references
  const merchantAuthority = new PublicKey(merchantPubKeyRaw);
  // Keypair is used only for signing the transaction
  const merchantKeypair = decodeSignerKeypair(merchantPrivKey);
  const userWallet = new PublicKey(userWalletAddress);

  const [merchantPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("merchant"), merchantAuthority.toBuffer()],
    programId,
  );

  const userTokenAccount = await getAssociatedTokenAddress(
    pointsMint,
    userWallet,
    false,
    TOKEN_PROGRAM_ID,
  );

  // Build instruction data: 8-byte discriminator + u64 little-endian
  const discriminator = getEarnPointsDiscriminator();
  const amountBuf = Buffer.alloc(8);
  amountBuf.writeBigUInt64LE(BigInt(Math.round(spendAmountIdr)));
  const data = Buffer.concat([discriminator, amountBuf]);

  const accounts: AccountMeta[] = [
    { pubkey: merchantPda, isSigner: false, isWritable: true },
    { pubkey: pointsMint, isSigner: false, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: userWallet, isSigner: false, isWritable: false },
    { pubkey: merchantAuthority, isSigner: true, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    programId,
    keys: accounts,
    data,
  });

  const connection = new Connection(rpcUrl, "confirmed");
  const tx = new Transaction().add(instruction);

  const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [merchantKeypair],
    {
      commitment: "confirmed",
    },
  );

  return signature;
}
