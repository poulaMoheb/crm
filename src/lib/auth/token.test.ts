import { describe, it, expect } from "vitest";
import { generateSessionToken, hashSessionToken } from "./token";

describe("session tokens", () => {
    it("generates unique, url-safe tokens with enough entropy", () => {
        const a = generateSessionToken();
        const b = generateSessionToken();
        expect(a).not.toBe(b);
        expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
        expect(a.length).toBeGreaterThanOrEqual(43);
    });

    it("hashing is deterministic and differs from the token", () => {
        const t = generateSessionToken();
        expect(hashSessionToken(t)).toBe(hashSessionToken(t));
        expect(hashSessionToken(t)).not.toBe(t);
    });

    it("produces a 64-character hex digest", () => {
        expect(hashSessionToken("abc")).toMatch(/^[0-9a-f]{64}$/);
    });
});