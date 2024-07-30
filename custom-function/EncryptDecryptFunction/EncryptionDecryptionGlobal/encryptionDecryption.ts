import * as crypto from "crypto";
import customHash from "./customHash";
import * as dotenv from "dotenv";
import {
  CustomCompareResultType,
  CustomCompareType,
  CustomEncryptionDecryptionData,
  CustomEncryptionDecryptionResult,
} from "../Model/EncryptionDecryption.DataType";

dotenv.config();

const customSalt = process.env.SALT_CHARACTER;
const key = process.env.KEY;

// Custom encryption function
function customEncrypt({ data }: CustomEncryptionDecryptionData): string {
  if (!key || !customSalt) {
    throw new Error("Key salt is error!!!");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(customHash(key + customSalt), "hex"),
    iv,
  );
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const encryptedData = `${iv.toString("hex")}:${encrypted}`;
  return encryptedData;
}

// Custom decryption function
function customDecrypt({
  data,
}: CustomEncryptionDecryptionData): CustomEncryptionDecryptionResult {
  if (!key || !customSalt) {
    throw new Error("Key salt is error!!!");
  }
  const [ivHex, encryptedText] = data.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(customHash(key + customSalt), "hex"),
    iv,
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return {
    DataEncryptedDecrypted: decrypted,
  };
}

function customCompare({
  decryptedData,
  encryptedData,
}: CustomCompareType): CustomCompareResultType {
  const decryptedResult = customDecrypt({ data: encryptedData });

  if (decryptedResult.DataEncryptedDecrypted === decryptedData) {
    return { result: true };
  } else {
    return { result: false };
  }
}

export { customEncrypt, customDecrypt, customCompare };
