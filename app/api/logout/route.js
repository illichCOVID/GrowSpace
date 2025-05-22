export async function POST() {
  return new Response("Вийшли з акаунта", {
    status: 200,
    headers: {
      "Set-Cookie": "user=; Path=/; Max-Age=0;",
    },
  });
}
