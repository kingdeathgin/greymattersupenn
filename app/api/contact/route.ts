import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, university, roleInterest, message } = body;

    if (!name || !email || !roleInterest || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, roleInterest, message" },
        { status: 400 }
      );
    }

    // Resend integration - requires RESEND_API_KEY
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Penn Grey Matters <onboarding@resend.dev>",
          to: [process.env.EDITORIAL_EMAIL || "editor@greymattersjournalpenn.org"],
          subject: `Get Involved: ${roleInterest} - ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>University:</strong> ${university || "Not provided"}</p>
            <p><strong>Role Interest:</strong> ${roleInterest}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Resend API error");
      }
    } else {
      // No Resend key - log for development
      console.log("Contact form submission:", { name, email, university, roleInterest, message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
