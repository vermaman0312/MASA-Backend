import { PrivateKeyPem, PublicKeyPem } from "./generateKeyPair";
import * as forge from 'node-forge';
import * as fs from 'fs';


// Read the public key from a file
export const readPublicKey = (userId: string) => {
    let publicKey;
    try {
        const publicKeyPemKey = PublicKeyPem(userId);
        if (publicKeyPemKey) {
            const directoryPath = './asymetric-key/publicKey';
            const filePath = `${directoryPath}/public-key-${userId}.pem`;
            const publicKeyPem = fs.readFileSync(filePath, 'utf-8');
            publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
        }
        return publicKey;
    } catch (error) {
        return null;
    }
}

// Read the private key from a file
export const readPrivateKey = (userId: string) => {
    let prviateKey;
    try {
        const privateKeyPemKey = PrivateKeyPem(userId);
        if (privateKeyPemKey) {
            const directoryPath = './asymetric-key/privateKey';
            const filePath = `${directoryPath}/private-key-${userId}.pem`;
            const privateKeyPem = fs.readFileSync(filePath, 'utf-8');
            prviateKey = forge.pki.privateKeyFromPem(privateKeyPem);
        }
        return prviateKey;
    } catch (error) {
        return null;
    }
}