import "server-only";
import bcrypt from "bcryptjs";
import {db} from "@/db/client";
import {users} from "@/db/schema";
import type {RegisterInput} from "@/validators/auth";

export async function registerUser(input: RegisterInput) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    const [created] = await db.insert(users).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        passwordHash,
        role: input.role,}).onConflictDoNothing({target: users.email}).returning({id: users.id})

        if(!created){
            return { ok: false as const,  error: "EMAIL_TAKEN" as const};
        }
        else{
            return{ok: true as const, userId: created.id};
        }
    }