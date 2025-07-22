import { loginUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import z from "zod";


const LoginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Password should be of minimu 6 char")
})



export async function POST(req: Request) {
    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || 'unknown'; 

    try {
        const body = await req.json()
        const parsed = LoginSchema.parse(body);

        const {
            user,
            accessToken,
            refreshToken,
            sessionId,
            expiresAt,
        } = await loginUser(parsed, userAgent, ip)

        const cookieStore = await cookies(); 
        cookieStore.set('session', sessionId, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'strict',
        });

         cookieStore.set('access', accessToken, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'strict',
        });

        cookieStore.set('refresh', refreshToken, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'strict',
        });

        

        return NextResponse.json({ message: "Login successful",accessToken,user }, { status: 200 })

    } catch (error: unknown) {
        let message = "Internal server error";
        if (error instanceof Error) {
            message = error.message
        }
        if (message === "User does not exist") return NextResponse.json({ error: message }, { status: 404 })
        if (message === "Invalid password") return NextResponse.json({ error: message }, { status: 401 })

        return NextResponse.json({ error: message }, { status: 500 })

    }
}