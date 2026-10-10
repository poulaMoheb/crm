import "server-only";
import { cache } from "react";
import { type SafeUser, SESSION_COOKIE, validateSession } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) {
        return null;
    }
    const result = await validateSession(token);

    return result?.user ?? null;

});

export async function requireCurrentUser(): Promise<SafeUser> {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}