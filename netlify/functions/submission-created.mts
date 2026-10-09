// Netlify runs this after each verified (non-spam) Netlify Forms submission,
// and appends "lead" submissions to a Google Sheet as a Google service account.
// Netlify Forms keeps its own copy either way.

import { createSign } from "node:crypto";

type Submission = {
  id: string;
  form_name: string;
  created_at: string;
  data: Record<string, unknown>;
};

// Sheet columns, in order: Received, one per form field, then the Netlify submission ID.
const FIELDS = ["name", "email", "company", "phone", "quantity", "rental-start", "rental-end", "delivery-location", "notes"];
const HEADERS = ["Received", "Name", "Email", "Company", "Phone", "Laptops", "Start date", "End date", "Delivery location", "Notes", "Netlify ID"];

export const handler = async (event: { body: string | null }) => {
  const { payload } = JSON.parse(event.body ?? "{}") as { payload: Submission };
  if (payload?.form_name !== "lead") return { statusCode: 200 };

  const { GOOGLE_SHEET_ID: sheetId, GOOGLE_SERVICE_ACCOUNT_EMAIL: email, GOOGLE_PRIVATE_KEY: key } = process.env;
  if (!sheetId || !email || !key) {
    console.error("GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY is not set; lead not copied to the sheet", payload.id);
    return { statusCode: 500 };
  }
  const tab = process.env.LEADS_SHEET_TAB || "Leads";
  const row = [payload.created_at, ...FIELDS.map((field) => String(payload.data[field] ?? "").trim()), payload.id];

  try {
    // Pasted keys often arrive with literal "\n" sequences instead of line breaks.
    const token = await accessToken(email, key.replace(/\\n/g, "\n"));
    await appendRow(token, sheetId, tab, row);
  } catch (error) {
    console.error("Could not add lead to Google Sheet", payload.id, error);
    return { statusCode: 502 };
  }
  return { statusCode: 200 };
};

async function appendRow(token: string, sheetId: string, tab: string, row: string[]) {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}`;
  const range = encodeURIComponent(`'${tab.replace(/'/g, "''")}'!A1`);
  const first = await fetch(`${base}/values/${range}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) });
  // Sheets answers 400 for a range on a tab that does not exist yet.
  if (first.status === 400) {
    await google(token, `${base}:batchUpdate`, { requests: [{ addSheet: { properties: { title: tab, gridProperties: { frozenRowCount: 1 } } } }] });
  } else if (!first.ok) {
    throw new Error(`Sheets read failed: ${first.status} ${await first.text()}`);
  }
  const hasHeader = first.ok && ((await first.json()) as { values?: unknown[] }).values?.length;
  // RAW stores visitor input exactly as typed, so "=IMPORTXML(...)" is never run as a formula.
  await google(token, `${base}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    values: hasHeader ? [row] : [HEADERS, row],
  });
}

async function accessToken(email: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: email, scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(privateKey, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Google sign-in failed: ${response.status} ${await response.text()}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

async function google(token: string, url: string, body: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Sheets request failed: ${response.status} ${await response.text()}`);
}
