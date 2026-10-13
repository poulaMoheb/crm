import { it, expect } from "vitest";
import { authSchemaRegister } from "./auth";

it("lowercases and trims the email", () => {
    const result = authSchemaRegister.parse({
        name: "Paula",
        email: "  Paula@Example.COM ",
        password: "a-long-test-password",
        workSpaceName: "Demo Co",
    });
    expect(result.email).toBe("paula@example.com");
});