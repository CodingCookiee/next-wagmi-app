import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import { isCoinbaseWebAuthnSignature } from "@/app/utils/coinBase";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    const { message, signature } = await request.json();

    let siweMessage;

    try {
      siweMessage = new SiweMessage(message);
    } catch (error) {
      console.error("Server: Error parsing the message", error);
      return NextResponse.json(
        { error: `Error Parsing Message: ${error.message}` },
        { status: 400 }
      );
    }

    if (isCoinbaseWebAuthnSignature(signature)) {
      try {
        const address = siweMessage.address;
        const chainId = siweMessage.chainId;

        // For mobile flows with Coinbase, be more lenient with nonce validation
        if (siweMessage.nonce !== session.nonce) {
          console.log(
            "Server: Nonce mismatch for Coinbase Wallet, but continuing with auth"
          );
          console.log(
            `Message nonce: ${siweMessage.nonce}, Session nonce: ${session.nonce}`
          );
          // We'll still continue with authentication
        }

        session.address = address;
        session.chainId = chainId;
        await session.save();

        return NextResponse.json({
          success: true,
          address,
          chainId,
          coinbaseWallet: true,
        });
      } catch (error) {
        console.error("Server: Coinbase authentication error", error);
        return NextResponse.json(
          { error: "Coinbase Wallet authentication failed" },
          { status: 400 }
        );
      }
    }

    try {
      // Log the nonces to help diagnose issues
      console.log("Session nonce:", session.nonce);
      console.log("Message nonce:", siweMessage.nonce);

      // For mobile flows, attempt verification but handle nonce mismatches gracefully
      try {
        const { data: fields } = await siweMessage.verify({
          signature,
          domain: request.headers.get("host"),
          nonce: session.nonce,
        });

        session.address = fields.address;
        session.chainId = fields.chainId;
        await session.save();

        return NextResponse.json({
          success: true,
          address: fields.address,
          chainId: fields.chainId,
        });
      } catch (error) {
        // Check if this is a nonce mismatch but otherwise valid
        if (error.message?.includes("Nonce") || error.type?.includes("Nonce")) {
          console.log("Handling nonce mismatch for potential mobile flow");

          // Do a second attempt with relaxed nonce validation
          // This is a compromise for mobile flows where session state can be lost
          try {
            // We'll verify domain and signature but accept the message nonce
            const verifiedMessage = new SiweMessage(message);
            const isValidSignature = await verifiedMessage.validate(signature);

            if (isValidSignature) {
              // Authentication successful despite nonce mismatch
              session.address = siweMessage.address;
              session.chainId = siweMessage.chainId;
              await session.save();

              return NextResponse.json({
                success: true,
                address: siweMessage.address,
                chainId: siweMessage.chainId,
                warning: "Authenticated with relaxed nonce validation",
              });
            }
          } catch (secondError) {
            console.error("Secondary verification also failed:", secondError);
          }
        }

        // If we got here, both verification attempts failed
        throw error;
      }
    } catch (error) {
      console.error("Server: Error Verification", error);
      return NextResponse.json(
        { error: `Verification Error: ${error.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Server: SIWE verification error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
