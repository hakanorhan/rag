import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import {
  CappedMap,
  create,
  deriveHmacKeySecret,
  randomInt,
} from "altcha-lib/frameworks/nextjs";

const secret = process.env.ALTCHA_HMAC_SECRET;
if (!secret) {
  throw new Error("ALTCHA_HMAC_SECRET is required");
}

export const altcha = create({
  hmacSignatureSecret: secret,
  hmacKeySignatureSecret: await deriveHmacKeySecret(secret),
  createChallengeParameters: () => ({
    algorithm: "PBKDF2/SHA-256",
    cost: 5_000,
    counter: randomInt(5_000, 10_000),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  }),
  deriveKey,
  store: new CappedMap<string, boolean>({
    maxSize: 1_000,
  }),
});
