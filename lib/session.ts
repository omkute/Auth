import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { JWTExpired } from "jose/errors";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET
const encodeKey = new TextEncoder().encode(secretKey)


const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

const accessKey = new TextEncoder().encode(accessSecret);
const refreshKey = new TextEncoder().encode(refreshSecret);


export async function createSession(userId: string, username:string, role:string){
    const expiresAt = new Date(Date.now() + 7 * 24*60*60*1000);
    const session = await encrypt({userId,username,role, expiresAt});

    (await cookies()).set("session", session,{
        httpOnly:true,
        secure:true,
        expires:expiresAt
    })
}


export async function generateAccessToken(userId: string, sessionId:string, role: string, username:string){
   return new SignJWT({userId, sessionId, role, username})
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime (process.env.ACCESS_TOKEN_EXPIRATION || "15m")
    .sign(accessKey)
    
    


}

export async function generateRefreshToken(userId:JWTPayload, sessionId:string){
    return new SignJWT({userId, sessionId})
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRATION || "7d")
    .sign(refreshKey)
    
}



type SessionPayload ={
    userId: string,
    username:string,
    role:string,
    expiresAt:Date
}
// TODO : encrypt the session uidtoken
export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime('1d')
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
export async function decryptRefreshToken(session: string | undefined =""){
    try {
        const {payload} = await jwtVerify(session, refreshKey,{
            algorithms:["HS256"]
        })
        
        return payload
    } catch (error) {
         if( error instanceof JWTExpired){
            return { expired:true}
        }
        console.log("Failed to verify the session",error);
        throw new Error("Decrypt Refresh Token Failed")

        
    }
}
export async function decryptAccessToken(session: string | undefined =""){
    try {
        const {payload} = await jwtVerify(session, accessKey,{
            algorithms:["HS256"]
        })
        return payload
    } catch (error) {
        if( error instanceof JWTExpired){
            return { expired:true}
        }
        console.log("Failed to verify the session",error);
        throw new Error("Decrypt Access Token Failed")
        
    }
}