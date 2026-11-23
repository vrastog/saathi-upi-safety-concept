// Server-side Gemini call. The key stays in GEMINI_API_KEY and never reaches the browser.
const ALLOWED_REASONS = new Set(["reported_payee", "escalating", "unknown_call", "new_payee", "high_amount"]);
const ALLOWED_RELATIONS = new Set(["Mummy", "Papa"]);
const FIELDS = ["senior_hi", "senior_en", "contact_en", "contact_hi"];
const hits = new Map();

function limited(ip) {
  const now = Date.now(), recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now); hits.set(ip, recent);
  return recent.length > 10;
}

module.exports = async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: "Gemini is not configured" });
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "local").split(",")[0];
  if (limited(ip)) return res.status(429).json({ error: "Too many requests" });

  const { amount, reasons, relation } = req.body || {};
  const valid = Number.isFinite(amount) && amount > 0 && amount <= 10_000_000 && Array.isArray(reasons) &&
    reasons.length <= 5 && reasons.every((r) => ALLOWED_REASONS.has(r)) && ALLOWED_RELATIONS.has(relation);
  if (!valid) return res.status(400).json({ error: "Invalid request" });

  const prompt = `You write safety copy for a simulated UPI fraud-prevention prototype.
Payment amount: INR ${Math.round(amount)}. Risk signals: ${reasons.join(", ") || "none"}. Senior's family label: ${relation}.
Return JSON with senior_hi, senior_en, contact_en, contact_hi.
senior_hi: simple warm Hindi, at most 35 words. senior_en: same meaning in plain English.
contact_en and contact_hi: at most 25 words, tell the family member what is happening and suggest a call.
Never say the payment is definitely a scam. Mention only the listed signals. Do not blame the senior. Remind the senior the choice is theirs.
Avoid gendered wording for the senior. Do not ask for a PIN, OTP, or bank details.`;

  try {
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 700, responseMimeType: "application/json" },
      }),
    });
    if (!upstream.ok) return res.status(502).json({ error: "Gemini request failed" });
    const data = await upstream.json();
    const parsed = JSON.parse(data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}");
    if (!FIELDS.every((f) => typeof parsed[f] === "string" && parsed[f].trim() && parsed[f].length <= 400)) {
      return res.status(502).json({ error: "Gemini returned an invalid response" });
    }
    return res.status(200).json({ source: "gemini", ...Object.fromEntries(FIELDS.map((f) => [f, parsed[f].trim()])) });
  } catch {
    return res.status(502).json({ error: "Gemini unavailable" });
  }
};
