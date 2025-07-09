import mongoose, { Schema, Model } from "mongoose";
import { Users } from "@/lib/types";
import bcrypt from "bcryptjs";

const userSchema = new Schema<Users>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Type the User model
type UserModel = Model<Users>;

// Check if model exists before compiling
const User: UserModel = mongoose.models.User as UserModel ||
    mongoose.model<UserModel>('User', userSchema);

export default User;