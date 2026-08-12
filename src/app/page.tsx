import {getServerSession} from "next-auth";
import Link from "next/link";
import {authOptions} from "@/app/auth";
import LogoutButton from "@/components/auth/LogoutButton"

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return(
    <main>
      <h1>Renthub</h1>
      {session?.user ? (
        <div>
          <h2>Welcome, {session.user.name}</h2>

          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>

          <LogoutButton />
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>

          <Link href="/login">Login</Link>
        </div>
      )}
    </main>
  );
}