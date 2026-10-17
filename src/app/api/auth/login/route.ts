import { isSameOrigin } from "@/lib/auth/csrf";
import { getDummyHash, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { authSchemaLogin } from "@/lib/validation/auth";
import { createSession, setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
    // Check if the request's origin is the same as the server's origin CSRF protection
    if (!isSameOrigin(request)) {
        return Response.json("Invalid origin", { status: 403 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch (error) {
        return Response.json("Internal JSON", { status: 400 });
    }

    // Validate the request body against the Zod schema
    const parse = authSchemaLogin.safeParse(body);
    if (!parse.success) {
        return Response.json({ errors: parse.error.flatten() }, { status: 400 });
    }

    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true, passwordHash: true }
    });

    // Verify the password
    const hash = user?.passwordHash ?? (await getDummyHash());
    const isVerified = await verifyPassword(hash, password);

    if (!isVerified || !user) {
        return Response.json("Invalid email or password", { status: 401 });
    }
    try {
        // Create a session for the user
        const { token, expiresAt } = await createSession(user.id);
        await setSession(token, expiresAt);
        return Response.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 200 });
    } catch (error) {
        console.error("Login failed:", error)
        return Response.json("Internal server error", { status: 500 });
    }


}