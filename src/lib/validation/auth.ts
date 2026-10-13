import { z } from "zod";

// Validation schema for user sign-in.
// Normalizes email casing and trims whitespace before validating format.
export const authSchemaLogin = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6).max(100)
});

// Validation schema for creating a new account.
// Includes the workspace name so registration data is validated consistently.
export const authSchemaRegister = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6).max(100),
    workSpaceName: z.string().trim().min(1).max(100),
});

// Infer the TypeScript types from the Zod schemas for use across the app.
export type AuthSchemaLogin = z.infer<typeof authSchemaLogin>;
export type AuthSchemaRegister = z.infer<typeof authSchemaRegister>;

