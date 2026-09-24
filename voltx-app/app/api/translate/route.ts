import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/translate — Webhook endpoint for auto-translation pipeline
 * 
 * Triggered by Firestore or background events when new English content is inserted/updated.
 * Creates a DRAFT Arabic translation (needs_review: true, published: false).
 * 
 * In production: wire this to Google Cloud Translation API or DeepL.
 * Currently: mock pipeline that creates empty translation stubs.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content_type, content_id, fields_to_translate } = body;

    if (!content_type || !content_id) {
      return NextResponse.json(
        { error: "content_type and content_id required" },
        { status: 400 }
      );
    }

    // Mock translation — in production, call real translation API here
    const translatedFields: Record<string, string> = {};
    
    if (fields_to_translate && typeof fields_to_translate === "object") {
      for (const [key, value] of Object.entries(fields_to_translate)) {
        // Mock: prefix with [AR] to indicate pending translation
        translatedFields[key] = `[AR-DRAFT] ${value}`;
      }
    }

    // In production, this would:
    // INSERT INTO content_translations (content_type, content_id, locale, translated_fields, needs_review, published)
    // VALUES ($1, $2, 'ar', $3, true, false)
    // ON CONFLICT (content_type, content_id, locale) DO UPDATE SET translated_fields = $3, needs_review = true

    console.log("[Translation Pipeline]", {
      content_type,
      content_id,
      locale: "ar",
      fields: Object.keys(translatedFields),
      needs_review: true,
      published: false,
    });

    return NextResponse.json({
      success: true,
      message: "Draft translation created",
      needs_review: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
