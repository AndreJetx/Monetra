import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { InvalidCredentialsError } from "@/features/identity/domain/errors/InvalidCredentialsError";
import { createAuthenticateUserUseCase } from "@/features/identity/infrastructure/factories";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/forgot-password");

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      }

      if (!isLoggedIn) return false;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.activeOrganizationId = user.activeOrganizationId;
      }

      if (trigger === "update" && session?.activeOrganizationId) {
        token.activeOrganizationId = session.activeOrganizationId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.activeOrganizationId = token.activeOrganizationId as string | undefined;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const authenticateUserUseCase = createAuthenticateUserUseCase();
          return await authenticateUserUseCase.execute({
            email: parsed.data.email,
            password: parsed.data.password,
          });
        } catch (error) {
          if (error instanceof InvalidCredentialsError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
