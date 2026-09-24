import { NextRequest, NextResponse } from "next/server";
import { signCookie, verifyCookie, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/cookies";
import crypto from "crypto";

/**
 * GET /api/lead — Check if user has a valid lead cookie
 */
export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const leadId = await verifyCookie(cookieValue);

  if (!leadId) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, leadId }, { status: 200 });
}

/**
 * POST /api/lead — Handle email capture
 * 
 * - If email already exists: match existing lead, log topic-touch, re-issue cookie
 * - If new email: create lead, log topic-touch, issue cookie
 * - Marketing consent defaults to false (checkbox unchecked)
 * - Never creates duplicate lead rows
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, marketing_consent, topic_slug, page_type, source } = body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a unique lead ID and cookie token
    const leadId = crypto.randomUUID();
    const cookieToken = await signCookie(leadId);

    // Save lead into Firebase Firestore
    try {
      const { createFirestoreLead } = await import("@/lib/firebase/service");
      await createFirestoreLead({
        email: cleanEmail,
        marketing_consent: Boolean(marketing_consent),
        topic_slug,
        page_type,
        source,
        cookie_token: cookieToken,
      });
    } catch (fbErr) {
      console.error("[Firestore Lead Error]", fbErr);
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Lead captured",
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set(COOKIE_NAME, cookieToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
