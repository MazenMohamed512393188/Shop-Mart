import { API_ENDPOINTS } from "@/lib/env";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Shop Mart",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "ahmed@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Your Password",
        },
      },
      async authorize(credentials) {
        const signInUrl = API_ENDPOINTS.signIn();
        const response = await fetch(signInUrl, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          return {
            id: data.user.email,
            userRes: data.user,
            tokenRes: data.token,
          };
        } else {
          throw new Error(data.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userRes = user.userRes;
        token.tokenRes = user.tokenRes;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userRes) {
        session.user = token.userRes as typeof session.user;
        session.token = token.tokenRes as typeof session.token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
