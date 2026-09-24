import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/click/[productId] — Log affiliate click
 * Records click data for analytics
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { locale, page_slug, placement } = body;

    // Generate session ID from request headers
    const sessionId =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Save click into Firebase Firestore
    try {
      const { logFirestoreClick } = await import("@/lib/firebase/service");
      await logFirestoreClick({
        product_id: productId,
        session_id: sessionId,
        locale,
        page_slug,
        placement,
      });
    } catch (fbErr) {
      console.error("[Firestore Click Error]", fbErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
