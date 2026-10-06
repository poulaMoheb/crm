import { hash, verify } from "@node-rs/argon2";



export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password);
    return hashedPassword;
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    try {
        return await verify(hashedPassword, password);
    } catch (err) {
        console.error("Error verifying password:", err);
        return false;
    }
}