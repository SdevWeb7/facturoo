import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authRateLimit, checkRateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-request",
  },
  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_FROM,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { createTransport } = await import("nodemailer");
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: "Connexion à Facturoo",
          text: `Connectez-vous à Facturoo en cliquant sur ce lien :\n\n${url}\n\nSi vous n'avez pas demandé cet email, vous pouvez l'ignorer.\n\nCe lien expire dans 24 heures.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Connexion à Facturoo</h2>
              <p>Cliquez sur le bouton ci-dessous pour vous connecter :</p>
              <a href="${url}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">Se connecter</a>
              <p style="margin-top: 24px; color: #666; font-size: 14px;">Si vous n'avez pas demandé cet email, vous pouvez l'ignorer en toute sécurité.</p>
              <p style="color: #999; font-size: 12px;">Ce lien expire dans 24 heures.</p>
            </div>
          `,
        });
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!valid) return null;
        return user;
      },
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      // Set 14-day trial for users created via magic link or OAuth
      if (user.id) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser && !dbUser.trialEndsAt) {
          await prisma.user.update({
            where: { id: user.id },
            data: { trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
          });
        }
      }
    },
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "nodemailer") {
        const { limited } = await checkRateLimit(authRateLimit, `auth:magic-link:${account.providerAccountId || "unknown"}`);
        if (limited) return false;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow same-origin URLs
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        console.log(`[auth] JWT: provider=${account?.provider} userId=${user.id}`);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
