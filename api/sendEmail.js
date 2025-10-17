// api/send-email.js — Next.js/Vercel API route using Resend v4
import { Resend } from "resend";

const ACCESS_CONTROL_ALLOW_ORIGIN = process.env.CORS_ORIGIN || "*";
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

function setCommonHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", ACCESS_CONTROL_ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendJson(res, status, body) {
  try {
    setCommonHeaders(res);
    return res.status(status).json(body);
  } catch (_) {
    try {
      res.statusCode = status;
      setCommonHeaders(res);
      res.end(JSON.stringify(body));
    } catch (_) {
      res.end('{"success":false,"error":"Unexpected server error"}');
    }
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").toLowerCase());
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try { return JSON.parse(req.body); } catch (_) { return null; }
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
  } catch (_) { return null; }
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 200, { success: true });
  if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });
  if (!resendApiKey) return sendJson(res, 500, { success: false, error: "Email service not configured" });

  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { success: false, error: "Invalid JSON payload" });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) return sendJson(res, 400, { success: false, error: "Missing required fields: name, email, message" });
  if (!isValidEmail(email)) return sendJson(res, 400, { success: false, error: "Invalid email format" });
  if (name.length > 200 || email.length > 320 || message.length > 5000) return sendJson(res, 400, { success: false, error: "Input exceeds allowed length" });

  try {
    const html = `
      <div style="font-family:system-ui; line-height:1.6; color:#111">
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <div style="white-space:pre-wrap; background:#f7f7f8; padding:12px; border-radius:8px">${escapeHtml(message)}</div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: ["sadhukhankalyan21@gmail.com"],
      subject: `New message from ${name}`,
      html,
      reply_to: email,
    });

    if (error) {
      console.error("Resend error:", error.message || error);
      const knownDomainIssue = /domain|verify|unauthorized|forbidden|blocked/i.test(error.message || "");
      return sendJson(res, 502, {
        success: false,
        error: knownDomainIssue
          ? "Email service not fully configured. Verify your domain and recipient in Resend."
          : error.message || "Failed to send email",
      });
    }

    return sendJson(res, 200, { success: true, message: "Email sent successfully", id: data?.id || null });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return sendJson(res, 500, { success: false, error: err instanceof Error ? err.message : "Internal server error" });
  }
}
