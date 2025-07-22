import { decryptAccessToken } from "@/lib/session";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    const cookieStore = cookies();
    
    const sessionToken = (await cookieStore).get("session")?.value;
    const accessToken = (await cookieStore).get("access")?.value;
    const refreshToken = (await cookieStore).get("refresh")?.value;
    // Deccrypt Tokens
 
}