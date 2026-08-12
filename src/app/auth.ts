import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {loginUser} from "@/services/auth.service";

export const authOptions = {
    session: {
        strategy: "jwt" as const,
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email:{
                    label: "Email",
                    type:"email",
                },
                password:{
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    return null;
                }
                try{
                    const user = await loginUser({
                        email: credentials.email,
                        password: credentials.password, 
                    });
                    return{
                        id: user.id,
                        name: user.fullName,
                        role: user.role,
                        email: user.email,
                    };
                } catch{
                    return null;
                }
            },
        }),
    ],
    callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
export default NextAuth(authOptions);