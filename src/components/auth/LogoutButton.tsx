"use client";
import {signOut} from "next-auth/react";
export default function LogoutButton(){
    async function handleLogout(){
        await signOut({
            callbackUrl: "/login",
        });
    }
    return(
        <button type="button" onClick={handleLogout}>
            Logout
        </button>
    )
}