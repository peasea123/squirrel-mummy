export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, message: 'No password provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const correctPassword = process.env.SQUIRREL_MUMMY_PASSWORD;

    if (!correctPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const isCorrect = password === correctPassword;

    return new Response(
      JSON.stringify({ success: isCorrect }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'An error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
