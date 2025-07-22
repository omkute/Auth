import { decryptRefreshToken, generateAccessToken } from "@/lib/session";
import Session from "@/models/Session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST( request: NextRequest) {
    const accessKey = process.env.ACCESS_TOKEN_SECRET
    const refreshToken = request.cookies.get("session")?.value
    const payload = await decryptRefreshToken(refreshToken);

    const session = await Session.findById(payload?.sessionId);
    if (!session || session.isRevoked || session.expiresAt.getTime() < Date.now()) {
        throw new Error("Invalid session");
    }

    const newAccessToken = await generateAccessToken( payload?.userId, payload?.sessionId, payload?.role, payload?.username );
    const cookieStore = await cookies();

    cookieStore.set('access', newAccessToken, { httpOnly: true, secure: true });

    return Response.json({ success: true });

}