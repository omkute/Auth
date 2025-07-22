import KeyStore from "@/models/KeyStore";
import { Users } from "./types";

export async function create(
    client: Users,
    primaryKey:string,
    secondaryKey:string
){
    const keys = await KeyStore.create({
        client,
        primaryKey,
        secondaryKey,
    })
    return keys

}