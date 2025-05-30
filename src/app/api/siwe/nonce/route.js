import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // Generate a new nonce and store it in the session
    const nonce = generateNonce();
    session.nonce = nonce;
    
    // Set a timestamp to help with debugging
    session.nonceTimestamp = Date.now();
    
    await session.save();

    // debug headers to help trace session issues
    const headers = new Headers({
      "Content-Type": "text/plain",
      "X-Nonce-Generated": "true",
      "Cache-Control": "no-store, max-age=0",
    });

    return new NextResponse(nonce, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating nonce:", error);
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}