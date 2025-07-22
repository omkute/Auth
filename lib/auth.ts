import User from "@/models/User"
import bcrypt from "bcryptjs"
import { createSession, generateAccessToken, generateRefreshToken } from "./session"
import dbConnect from "@/utils/connectDB"
import { v4 as uuidv4 } from 'uuid';
import Session from "@/models/Session";

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

export async function loginUser(
  { email, password }: { email: string; password: string },
  userAgent: string,
  ip: string
) {
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User does not exist');
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error('Invalid password');
  }

  const sessionId = uuidv4();
  const accessToken = await generateAccessToken(user.id, sessionId, user.role, user.username);
  const refreshToken = await generateRefreshToken(user.id, sessionId);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const absoluteExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await Session.create({
    // _id: sessionId
    sessionId:sessionId,
    userId: user.id,
    refreshToken: hashedRefreshToken,
    userAgent,
    ip,
    expiresAt,
    absoluteExpiry,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
    sessionId,
    expiresAt,
  };
}

export async function loginOnlyOneUser(
  { email, password }: { email: string; password: string },
  userAgent: string,
  ip: string
) {
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User does not exist');
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    throw new Error('Invalid password');
  }

  const existingSession = await Session.findOne({
  userId: user._id,
  isRevoked: false,
  expiresAt: { $gt: new Date() },
});

if(existingSession){
    Session.findByIdAndUpdate(existingSession._id,{
        isRevoked:true
    })
}

  const sessionId = uuidv4();
  const accessToken = await generateAccessToken(user.id, sessionId);
  const refreshToken = await generateRefreshToken(user.id, sessionId);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const absoluteExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await Session.create({
    // _id: sessionId
    sessionId:sessionId,
    userId: user.id,
    refreshToken: hashedRefreshToken,
    userAgent,
    ip,
    expiresAt,
    absoluteExpiry,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
    sessionId,
    expiresAt,
  };
}




export async function me() {

}