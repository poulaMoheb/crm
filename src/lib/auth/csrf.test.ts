import { describe, it, expect } from "vitest";
import { isSameOrigin } from "./csrf";

function req(origin?: string) {
    return new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: origin ? { origin } : {},
    });
}

describe("isSameOrigin", () => {
    it("accepts a matching origin", () => {
        expect(isSameOrigin(req("http://localhost:3000"))).toBe(true);
    });
    // write these yourself:
    // - a different host returns false
    // - a different port returns false
    // - a missing origin returns false
    // - "not a url" returns false (and doesn't throw)
    // - the literal string "null" returns false
});