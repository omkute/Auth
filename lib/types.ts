import type { Types } from 'mongoose';

export interface Users {
    id: string,
    username: string,
    email: string,
    role: "admin" | "moderator" | "user",
    password:string,
    createdAt: Date,
    updatedAt: Date
}

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
  expiresAt: Date;
}
export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
  expiresAt: number;
}

export interface AccessTokenPlayload {
  userId: string;
  sessionId: string;
  username: string;
  role: string;
  expiresAt: number;
}
export interface Session{
 sessionId: string;
  userId: string;
  refreshToken: string;
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  absoluteExpiry: Date;
}

export interface SafeUser {
  id?: string;
  email: string;
  username:string
  password:string
}

declare global {
  var mongoose: {
    // model(arg0: string, userSchema: Schema<Users, Model<Users, any, any, any, Document<unknown, any, Users, any> & Users & { _id: Types.ObjectId; } & { __v: number; }, any>, {}, {}, {}, {}, DefaultSchemaOptions, Users, Document<unknown, {}, FlatRecord<Users>, {}> & FlatRecord<Users> & { _id: Types.ObjectId; } & { __v: number; }>): unknown;
    conn: typeof import("mongoose") | null
    promise: Promise<typeof import("mongoose")> | null
  }
}
