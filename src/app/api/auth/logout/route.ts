import { isSameOrigin } from "@/lib/auth/csrf";
import { destroySession } from "@/lib/auth/session";

export async function POST(request: Request) {

    // Check if the request's origin is the same as the server's origin CSRF protection
    if (!isSameOrigin(request)) {
        return Response.json({ error: "Invalid origin" }, { status: 403 });
    }
    try {
        await destroySession();
    } catch (error) {
        console.error("Logout failed:", error)
        return Response.json({ error: "Logout Failed" }, { status: 500 });
    }
    return new Response(null, { status: 204 })
}