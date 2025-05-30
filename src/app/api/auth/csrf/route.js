import { getToken } from "next-auth/jwt";

export async function GET(req) {
  const token = await getToken({ req });

  // Generate a CSRF token
  const csrfToken = Math.random().toString(36).substring(2, 15);

  return new Response(JSON.stringify({ csrfToken }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
