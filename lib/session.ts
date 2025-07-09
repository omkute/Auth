import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET
const encodeKey = new TextEncoder().encode(secretKey)


export async function createSession(userId: string, username:string, role:string){
    const expiresAt = new Date(Date.now() + 7 * 24*60*60*1000);
    const session = await encrypt({userId,username,role, expiresAt});

    (await cookies()).set("session", session,{
        httpOnly:true,
        secure:true,
        expires:expiresAt
    })
}

export async function deleteSession(){
    (await cookies()).delete("session")
}


type SessionPayload ={
    userId: string,
    username:string,
    role:string,
    expiresAt:Date
}
export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodeKey)
}

export async function decrypt(session: string | undefined =""){
    try {
        const {payload} = await jwtVerify(session, encodeKey,{
            algorithms:["HS256"]
        })
        return payload
    } catch (error) {
        console.log("Failed to verify the session",error);
        
    }
}