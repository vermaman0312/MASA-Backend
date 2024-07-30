import * as crypto from "crypto";

// Custom hash function
function customHash(data: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

export default customHash;