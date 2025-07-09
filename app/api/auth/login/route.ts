import { loginUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import z from "zod";


const LoginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Password should be of minimu 6 char")
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = LoginSchema.parse(body);

        await loginUser(parsed)
        
        return NextResponse.json({ message: "Login successful" }, { status: 200 })

    } catch (error: unknown) {
        let message = "Internal server error";
        if(error instanceof Error){
            message = error.message
        }
        if (message === "User does not exist") return NextResponse.json({ error: message }, { status: 404 })
        if (message === "Invalid password") return NextResponse.json({ error: message }, { status: 401 })

        return NextResponse.json({ error: message }, {status: 500 })

    }
}