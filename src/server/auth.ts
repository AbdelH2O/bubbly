import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import jwt from "jsonwebtoken";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    supabaseAccessToken?: string;
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    // session({ session, user }) {
    //   if (session.user) {
    //     session.user.id = user.id;
    //     // session.user.role = user.role; <-- put other properties on the session here
    //   }
    //   return session;
    // },
    session({ session, user }) {
      const signingSecret = env.SUPABASE_JWT_SECRET;
      // console.log(signingSecret);
      
      if (signingSecret) {
        const payload = {
          iss: "supabase",
          role: "authenticated",
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          iat: Math.floor(new Date().getTime() / 1000),
          // nbf: 0,
          sub: user.id,
          email: user.email,
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      return session
    },
  },
  // adapter: PrismaAdapter(prisma),
  adapter: SupabaseAdapter({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    secret: env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  providers: [
    EmailProvider({
      server: env.SMTP_SERVER,
      from: env.SMTP_FROM
      // TODO: Add custom email templates
    }),
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  theme: {
    brandColor: "#991B1B",
    colorScheme: "light",
    buttonText: "#fff",
    logo: "/bbly.png",
  },

};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
