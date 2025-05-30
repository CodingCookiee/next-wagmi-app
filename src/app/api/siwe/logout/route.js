import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET, 
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    httpOnly: true,
    path: "/", 
    maxAge: 60 * 60 * 24 * 30,
  },
};

async function clearSession() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // Clear all session data
    session.address = undefined;
    session.chainId = undefined;
    session.nonce = undefined;
    
    await session.destroy();

    return NextResponse.json({
      success: true,
      message: "Session cleared successfully",
    });
  } catch (error) {
    console.error("Error logging out", error);
    return NextResponse.json(
      { error: "Failed to logout user", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return clearSession();
}

export async function GET() {
  return clearSession();
}