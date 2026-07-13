import { NextResponse } from "next/server";

/**
 * Per-hotel detail via SearchAPI Property API can be added later.
 * The assignment only requires search results cards.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return NextResponse.json(
    {
      message:
        "Hotel detail endpoint is not required by the assignment. Use search results cards.",
      id,
    },
    { status: 501 },
  );
}
