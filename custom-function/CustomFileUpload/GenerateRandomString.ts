import * as dotenv from "dotenv";

dotenv.config();

export const generateRandomString = (length: number): string => {
    const characters = process.env.RANDON_CHARACTER;
    if (!characters) {
        throw new Error("Key are undefined!!!");
    }
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};