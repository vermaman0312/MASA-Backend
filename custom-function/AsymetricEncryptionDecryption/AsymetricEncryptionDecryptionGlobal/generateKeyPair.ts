import * as forge from 'node-forge';
import * as fs from 'fs';

// Key generation
const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });


// Save the public key to a file
export const PublicKeyPem = (loggedInUserId: string) => {
    try {
        const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        const directoryPath = './asymetric-key/publicKey';
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }
        const filePath = `${directoryPath}/public-key-${loggedInUserId}.pem`;
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the existing public key file
            fs.unlinkSync(filePath);
        }
        // Use writeFile to handle errors and async operations
        fs.writeFileSync(filePath, publicKeyPem);

        return publicKeyPem;
    } catch (error) {
        return null;
    }
}

// Save the private key to a file
export const PrivateKeyPem = (loggedInUserId: string) => {
    try {
        const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
        const directoryPath = './asymetric-key/privateKey';
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }
        const filePath = `${directoryPath}/private-key-${loggedInUserId}.pem`;
        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the existing private key file
            fs.unlinkSync(filePath);
        }
        // Use writeFile to handle errors and async operations
        fs.writeFileSync(filePath, privateKeyPem);

        return privateKeyPem;
    } catch (error) {
        return null;
    }
}


