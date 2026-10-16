import z from 'zod';
import { authSchemaRegister } from '@/lib/validation/auth';
import { isSameOrigin } from "@/lib/auth/csrf";
import { hashPassword } from '@/lib/auth/password';
import { prisma } from '@/lib/prisma';
import { createSession, setSession } from '@/lib/auth/session';

export async function POST(request: Request) {
    // Check if the request's origin is the same as the server's origin CSRF protection
    if (!isSameOrigin(request)) {
        return new Response("Invalid origin", { status: 403 });
    }
    let body: unknown;
    try {
        body = await request.json();
    } catch (error) {
        return Response.json("Internal JSON", { status: 400 });
    }

    // Validate the request body against the Zod schema
    const parse = authSchemaRegister.safeParse(body);

    if (!parse.success) {
        return Response.json({ errors: z.flattenError(parse.error), }, { status: 400 });
    }

    const { name, email, password, workSpaceName } = parse.data;
    try {
        const hashedPassword = await hashPassword(password);
        const tenant = await prisma.tenant.create({
            data: {
                name: workSpaceName,
                users: {
                    create: {
                        name,
                        email,
                        passwordHash: hashedPassword,
                        role: "ADMIN",
                    }
                },
            },
            select: { users: { select: { id: true, name: true, email: true, role: true } } }
        });
        const user = tenant.users[0];
        if (!user) {
            return new Response("Failed to create tenant or user", { status: 500 });
        }
        const { token, expiresAt } = await createSession(user.id);
        await setSession(token, expiresAt);
        return Response.json({ message: "User Registered Successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });





    } catch (error) {
        // Prisma P2002 (duplicate email) -> 409
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
            return Response.json("Email already in use", { status: 409 });
        }
        // anything else -> log the error, return 500
        return Response.json("Internal server error", { status: 500 });
    }

}
