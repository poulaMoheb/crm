import "server-only";
import { cookies } from "next/headers";
import { generateSessionToken, hashSessionToken } from "./token";
import { prisma } from "../prisma";
import { Role } from "@/generated/prisma/enums";

export type SafeUser = {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: Role;
};

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 30; // Session duration in days
const SESSION_DURATION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000; // Session duration in milliseconds

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = generateSessionToken();
    const hashedToken = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS); // 30 days

    await prisma.session.create({
        data: {
            id: hashedToken,
            userId: userId,
            expiresAt: expiresAt
        }
    });
    return { token, expiresAt };
}

export async function validateSession(
    token: string,
): Promise<{
    sessionId: string;
    user: SafeUser
} | null> {
    const hashedToken = hashSessionToken(token);
    const sessionRecord = await prisma.session.findUnique({
        where: { id: hashSessionToken(token) },
        select: {
            id: true,
            expiresAt: true,
            user: {
                select: { id: true, tenantId: true, name: true, email: true, role: true },
            },
        },
    });
    if (!sessionRecord) {
        // where we navigate to login page if no session is found
        return null;
    }
    if (sessionRecord.expiresAt <= new Date()) {
        await prisma.session.deleteMany({ where: { id: sessionRecord.id } });
        return null;
    }
    return {
        sessionId: sessionRecord.id,
        user: sessionRecord.user
    };
}

export async function setSession(token: string, expiresAt: Date): Promise<void> {
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt
    });
}

export async function destroySession(): Promise<void> {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;

    if (token) {
        await prisma.session.deleteMany({
            where: {
                id: hashSessionToken(token)
            }
        });
    }

    store.delete(SESSION_COOKIE);
}


