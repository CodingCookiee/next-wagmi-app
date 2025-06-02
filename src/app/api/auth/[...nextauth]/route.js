import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "siwe",
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
            // console.log("Missing message or signature");
            return null;
          }

          // console.log("Raw message received:", credentials.message);
          // console.log("Raw signature received:", credentials.signature);

          let siwe;
          
          try {
            const messageObj = JSON.parse(credentials.message);
            siwe = new SiweMessage(messageObj);
          } catch (parseError) {
            console.error("Failed to parse SIWE message:", parseError);
            return null;
          }

          // console.log("SIWE verification attempt:", {
          //   address: siwe.address,
          //   domain: siwe.domain,
          //   nonce: siwe.nonce,
          //   statement: siwe.statement
          // });

          const result = await siwe.verify({
            signature: credentials.signature,
          });

          if (result.success) {
            // console.log("SIWE verification successful for", siwe.address);
            return {
              id: siwe.address,
              address: siwe.address,
              name: siwe.address,
            };
          }

          // console.log("SIWE verification failed:", result);
          return null;
        } catch (e) {
          console.error("SIWE authorization error:", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          name: token.sub,
          address: token.sub,
        };
        session.address = token.sub;
        return session;
      }
      return null;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.address = user.id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "fa3fb4e7bf96a72dbc4a5f2c8b3a48d9b6e5d1ce2a7f4b96e0d8c3a2f1b5e7d9",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
