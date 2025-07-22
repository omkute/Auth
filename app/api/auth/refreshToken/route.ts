import { decryptRefreshToken } from "@/lib/session";
import { AccessTokenPlayload, RefreshTokenPayload } from "@/lib/types";
import Session from "@/models/Session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        // get the cookies for storage 
        const sessionToken = (await cookieStore).get("session")?.value;
        const getRefreshToken = (await cookieStore).get("refresh")?.value;
        const refreshToken = await decryptRefreshToken(getRefreshToken);
        // validate cookies
        if (refreshToken && refreshToken.sessionId === sessionToken) {
            return NextResponse.json({ message: " Session Mismatch" }, { status: 404 })
        }

        // check session in DB && refreshToken
        const session = await Session.findOne({
            sessionId: sessionToken,
            isRevoked: false
        }).populate('userId')

        // check session exp && absolute exp
        if (!session || session.expiresAt < new Date() || session.absoluteExpiry < new Date()) {
            return NextResponse.json({ message: " Session Expired or Invlid" }, { status: 404 })
        }

        // verify refresh token in form DB
        if (refreshToken && session.refreshToken === refreshToken.refreshToken) {
            return NextResponse.json({ message: " Invlid refresh Token " }, { status: 404 })
        }

        //Generate new accessToken && new RefreshToken
        const newAccessPayload: AccessTokenPlayload = {
            userId: session.userId.toString(),
            sessionId: session.sessionId,
            username: session.userId.username,
            role: session.userId.role,
            expiresAt: Date.now() + (30 * 60 * 1000)
        }



        // TODO: Encrypt tokens 

        // Rotated refreshToken
        let newRefreshToken = refreshToken
        if (shouldRotateRefreshToken()) {
            const newRefreshPayload: RefreshTokenPayload = {
                sessionId: session.sessionId,
                userId: session.userId.toString(),
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
            };
        }

        session.refreshToken = await newRefreshToken  ;
        session.expiresAt = new Date(newAccessPayload.expiresAt)

        return{
            accessToken: newAccessPayload,
            refreshToken: newRefreshToken,
            sessionToken
        }



    } catch (error) {
        throw new Error('Token refresh failed');
    }
}

shouldRotateRefreshToken(){
    
}