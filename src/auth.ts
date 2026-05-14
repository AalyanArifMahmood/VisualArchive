import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface AdminUser {
  email: string;
  password: string;
}

function getAdminUsers(): AdminUser[] {
  try {
    return JSON.parse(process.env.ADMIN_USERS || "[]");
  } catch {
    return [];
  }
}

export const ADMIN_EMAILS = getAdminUsers().map((u) => u.email);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const users = getAdminUsers();
        const match = users.find(
          (u) => u.email === email && u.password === password
        );

        if (match) {
          return { id: match.email, email: match.email, name: "Admin" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
