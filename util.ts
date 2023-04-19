import crypto from "node:crypto"

export const generateSignature = (privateKey: string, object: string) => {
    const hash = crypto.createHash("sha256");
    hash.update(object)
    const hashed = hash.digest("hex");
    return crypto.privateEncrypt({ key: privateKey, passphrase: '' }, Buffer.from(hashed, "utf-8")).toString('base64');
}