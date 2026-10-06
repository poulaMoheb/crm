import { randomBytes, createHash } from "node:crypto";

// Generates a random session token
export function generateSessionToken(): string {
    return randomBytes(32).toString("base64url");
}

// Hashes a session token using SHA-256
export function hashSessionToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}