import {
  TAsymetricDecryptionModel,
  TAsymetricEncryptionModel,
  TAsymetricResponse,
} from "../Model/AsymetricEncryptionDecryption.DataType";
import { readPublicKey, readPrivateKey } from "./asymetricReadKey";
import * as forge from "node-forge";
import { decodeToken } from "../../../src/utils/Token/Token.Util";

// Asymetric Encryption
export async function customAsymetricEncryption({
  decryptedMessage,
  authorizationHeader,
}: TAsymetricEncryptionModel): Promise<TAsymetricResponse> {
  const userId = await decodeToken(authorizationHeader);
  if (!userId) {
    throw new Error("Undefined public key!!!");
  }
  const readPublicKeyString = readPublicKey(userId.toString());
  if (readPublicKeyString === null) {
    throw new Error("Public key is empty!!!");
  }
  // Ensure readPrivateKey is not undefined before proceeding
  if (!readPublicKeyString) {
    throw new Error("Undefined public key!!!");
  }
  const encrypted = readPublicKeyString.encrypt(decryptedMessage);
  return { data: forge.util.encode64(encrypted) };
}

// Asymetric Decryption
export async function customAsymetricDecryption({
  encryptedMessage,
  authorizationHeader,
}: TAsymetricDecryptionModel): Promise<TAsymetricResponse> {
  const userId = await decodeToken(authorizationHeader);
  if (!userId) {
    throw new Error("Undefined private key!!!");
  }
  const readPrivateKeyString = readPrivateKey(userId.toString());
  if (readPrivateKeyString === null) {
    throw new Error("Private key is empty!!!");
  }
  // Ensure readPrivateKey is not undefined before proceeding
  if (!readPrivateKeyString) {
    throw new Error("Undefined private key!!!");
  }
  const encrypted = forge.util.decode64(encryptedMessage);
  const decrypted = readPrivateKeyString.decrypt(encrypted);
  return { data: decrypted };
}
