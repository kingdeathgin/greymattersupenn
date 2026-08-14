import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Resend audience or simple DB - requires RESEND_API_KEY
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      // Add to Resend audience if configured
      const audienceId = process.env.RESEND_AUDIENCE_ID;
      if (audienceId) {
        const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to subscribe");
        }
      } else {
        console.log("Newsletter signup:", email);
      }
    } else {
      console.log("Newsletter signup:", email);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to subscribe" },
      { status: 500 }
    );
  }
}
