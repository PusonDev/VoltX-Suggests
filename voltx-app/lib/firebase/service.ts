import { db } from "./client";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Re-export seed functions and data
export * from "./seed";

/**
 * Capture Lead in Firestore
 */
export async function createFirestoreLead(leadData: {
  email: string;
  marketing_consent: boolean;
  topic_slug?: string;
  page_type?: string;
  source?: string;
  cookie_token?: string;
  locale?: string;
}) {
  try {
    const leadsRef = collection(db, "leads");
    const docRef = await addDoc(leadsRef, {
      ...leadData,
      created_at: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error creating lead in Firestore:", err);
    return { success: false, error: err };
  }
}

/**
 * Log Affiliate Click in Firestore
 */
export async function logFirestoreClick(clickData: {
  product_id: string;
  session_id: string;
  locale?: string;
  page_slug?: string;
  placement?: string;
}) {
  try {
    const clicksRef = collection(db, "affiliate_clicks");
    const docRef = await addDoc(clicksRef, {
      ...clickData,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error logging click in Firestore:", err);
    return { success: false, error: err };
  }
}
