"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage(){
    const [email, setEmail ] = useState("");
    const [password, setPassword ] = useState("");
    const [error, setError ] = useState("");
    async function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault;
        setError("");
        const result = await signIn("credentials", {
            email, password, redirect: false, callbackUrl: "/",
        });
        console.log(result);
        if(result?.error){
            setError("Invalid email or password");
            return;
        }
        window.location.href = result?.url ?? "/";
    }
    return(
        <main>
            < h1>Renthub login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="password"> Password</label>
                    <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </main>
    );
}