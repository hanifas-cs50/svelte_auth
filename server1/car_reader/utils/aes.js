const crypto = require("crypto");

const ENCRYPTION_KEY = crypto.scryptSync(process.env.AES_SECRET || "super-secret", 'salt', 32);

function decryptId(encryptedId) {
  try {
    const [ivHex, encryptedHex] = encryptedId.split(":");
    if (!ivHex || !encryptedHex) throw new Error("Invalid format");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return parseInt(decrypted.toString(), 10);
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
}

module.exports = { decryptId };
