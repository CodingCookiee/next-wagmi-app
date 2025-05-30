import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

// Configure Next Auth options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            return null;
          }

          const siwe = new SiweMessage(JSON.parse(credentials.message));
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000"
          );

          const result = await siwe.verify({
            signature: credentials.signature,
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          console.error("SIWE authorization error", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      session.user = {
        name: token.sub,
        // Additional user properties here if needed
      };
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "fa3fb4e7bf96a72dbc4a5f2c8b3a48d9b6e5d1ce2a7f4b96e0d8c3a2f1b5e7d9",
  pages: {
    signIn: "/signin",
    // other auth pages here
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
