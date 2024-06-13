import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";

import { db } from "@/utils/db";

export const AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      id: "Credentials",
      authorize: async (credentials) => {
        try {
          const email = credentials?.email;
          const password = credentials?.password;

          //  VALIDATE THE USER INPUTS FROM OUR SERVERS
          if (!email || !password) {
            return "missing fields";
          }

          // CHECK IF THE EMAIL IS IN THE DATABASE ALREADY
          const isUserAvailable = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!isUserAvailable) {
            return "Email Not found";
          }

          //COMPARING MY HASHIED PASSWORD
          await bcrypt.compare(password, isUserAvailable?.password);

          return isUserAvailable;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      return session;
    },
  },
};
