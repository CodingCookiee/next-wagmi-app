import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function GET() {
  try {
    const cookiesStore = await cookies();
    const session = await getIronSession(cookiesStore, sessionOptions);

    if (!session.address) {
      console.log("Server: User not authenticated");
      return NextResponse.json({ address: null });
    }

    return NextResponse.json({
      address: session.address,
      chainId: session.chainId,
    });
  } catch (error) {
    console.error("Error getting session", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
