import crypto from 'crypto';
import * as dotenv from "dotenv";

dotenv.config();
const secret = process.env.CHECKSUM_KEY;

// Function to generate a custom checksum //
export function generateOneTimeChecksum(userId: string): { checksum: string, used: boolean } {
    const hash = crypto.createHmac('sha256', secret as string).update(userId).digest('hex');
    return { checksum: hash, used: false };
}

// Function to validate a one-time checksum
export function validateOneTimeChecksum(checksumData: { checksum: string, used: boolean }, userId: string): boolean {
    if (checksumData.used) {
        console.log('Checksum has already been used.');
        return false;
    }
    const hash = crypto.createHmac('sha256', secret as string).update(userId).digest('hex');
    if (checksumData.checksum === hash) {
        checksumData.used = true;
        console.log('Checksum validated successfully.');
        return true;
    } else {
        console.log('Checksum validation failed.');
        return false;
    }
}