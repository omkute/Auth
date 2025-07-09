import  {signupUser} from "@/lib/auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod"

const SignUpSchema = z.object({
    username:z.string().min(3, "Name is required"),
    email: z.string().email("Invalid Email"),
    password:z.string().min(6,"Password should be of minimum 6 char")
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = SignUpSchema.parse(body)
        const user = await signupUser(parsed)

        return NextResponse.json({ message: "Signup successful",user},{status: 200} )
    } catch (error:unknown) {
        if (error instanceof ZodError) {
      const formatted = error.errors.map(err => ({
        path: err.path[0], // 'email', 'password' etc.
        message: err.message
      }))
      return NextResponse.json({ errors: formatted }, { status: 422 })
    }

    //    let  message =  "Internal server error";
    //    if(error instanceof Error){
    //     message = error.message 
    //    }
    //    if(message === "User already exists") return NextResponse.json({error:"message"},{status: 400})     
    //    if(message === "ZodError") return NextResponse.json({ error: message.errors[0].message },{status: 400})     
       
    //    return NextResponse.json({ error: message }, { status: 500 },)
            

    }
}