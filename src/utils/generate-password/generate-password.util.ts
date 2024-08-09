import dotenv from 'dotenv';

dotenv.config();
const randomCharacter = process.env.RANDOM_CHARACTER;

export const generateRandomPassword = (digit: number): Promise<string> => {
  const chars = randomCharacter;
  if (!chars) {
    return Promise.resolve("Something went wrong!!!");
  }
  const string_length = digit;
  let randomstring = "";
  for (let i = 0; i < string_length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return Promise.resolve(randomstring);
};
