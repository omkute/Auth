import User from "@/models/User"
import bcrypt from "bcryptjs"
import { createSession } from "./session"
import dbConnect from "@/utils/connectDB"

type signup = {
    username: string,
    email: string,
    password: string
}
export async function signupUser({ username, email, password }: signup) {
    await dbConnect()
    const existingUser = await User.findOne({ email})

    if(existingUser) throw new Error("Email already registered from auth")

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password:hashedPassword
    })
    await createSession( user.id, user.username, user.role)
    return user
}
type login = {
    email: string,
    password: string
}
export async function loginUser({ email, password }: login) {
    await dbConnect()
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("User Does not exists")

    }
    const passwordCheck = await bcrypt.compare(password, user.password)
    if (!passwordCheck) {
        throw new Error("Invalid Password")
    }

    createSession(user.id, user.email, user.role)
    return user
}
export async function me() {

}