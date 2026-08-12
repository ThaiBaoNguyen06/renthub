import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import {NextResponse} from "next/server";
import {verifyPassword} from "@/lib/password";
import type {RegisterInput, LoginInput,} from "@/validators/auth.schema";

export async function registerUser(data: RegisterInput){
    const {fullName, email, password, phone, role} = data;
    const existingUser = await db.select({id: users.id}).from(users).where(eq(users.email, email)).limit(1);
    if(existingUser.length > 0){
        return NextResponse.json({
            success: false,
            message: "An account with this email already exists",
        },
        {status: 409},);
    }
    const passwordHash = await hashPassword(password);
    const [createdUser] = await db.insert(users).values({
        fullName,
        email,
        passwordHash,
        phone: phone || null,
        role,
    }).returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
    });
    return createdUser;
}

export async function loginUser(data: LoginInput){
    const {email, password} = data;
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if(!user){
        throw new Error("INVALID_CREDENTIALS");
    }
    const passwordIsValid = await verifyPassword(password, user.passwordHash);
    if (!passwordIsValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    if(user.status != "active"){
        throw new Error("ACCOUNT_NOT_ACTIVE");
    }
    return{
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
    };
}