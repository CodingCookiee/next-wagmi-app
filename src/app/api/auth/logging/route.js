export async function POST(req) {
  //? This is just a placeholder for the NextAuth logging endpoint
  //? Implement actual logging
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
