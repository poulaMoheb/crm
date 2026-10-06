import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
    it("produces an argon2id hash, not the plaintext", async () => {
        const hash = await hashPassword("correct horse battery staple");
        expect(hash).not.toContain("correct horse");
        expect(hash.startsWith("$argon2id$")).toBe(true);
    });

    it("accepts the right password", async () => {
        const hash = await hashPassword("s3cret-pass");
        expect(await verifyPassword(hash, "s3cret-pass")).toBe(true);
    });

    it("rejects the wrong password", async () => {
        const hash = await hashPassword("s3cret-pass");
        expect(await verifyPassword(hash, "wrong")).toBe(false);
    });

    it("salts: same password gives different hashes", async () => {
        const [a, b] = await Promise.all([hashPassword("same"), hashPassword("same")]);
        expect(a).not.toBe(b);
    });

    it("returns false for a malformed hash instead of throwing", async () => {
        expect(await verifyPassword("not-a-hash", "anything")).toBe(false);
    });
});