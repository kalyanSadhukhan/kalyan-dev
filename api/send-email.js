// api/send-email.js — Next.js/Vercel API route using Resend v4
import { Resend } from "resend";

// CORS configuration (adjust origin if you want to restrict)
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
    if (typeof res.status === "function" && typeof res.json === "function") {
      return res.status(status).json(body);
    }
  } catch (_) {}
  // Fallback for environments where res.json/status are not available
  try {
    res.statusCode = status;
    setCommonHeaders(res);
    res.end(JSON.stringify(body));
  } catch (err) {
    // last resort to avoid empty responses
    try {
      res.end("{\"success\":false,\"error\":\"Unexpected server error\"}");
    } catch (_) {}
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || "").toLowerCase());
}

async function readJsonBody(req) {
  // Next.js API routes usually parse JSON already. If not, read the stream.
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim().length > 0) {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return null;
    }
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { success: true });
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { success: false, error: "Method not allowed" });
  }

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return sendJson(res, 500, { success: false, error: "Email service not configured" });
  }

  const body = await readJsonBody(req);
  if (!body) {
    return sendJson(res, 400, { success: false, error: "Invalid JSON payload" });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();

  // Validations
  if (!name || !email || !message) {
    return sendJson(res, 400, { success: false, error: "Missing required fields: name, email, message" });
  }

  if (!isValidEmail(email)) {
    return sendJson(res, 400, { success: false, error: "Invalid email format" });
  }

  // Basic length limits to avoid abuse
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return sendJson(res, 400, { success: false, error: "Input exceeds allowed length" });
  }

  try {
    const subject = `New message from ${name}`;
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji; line-height:1.6; color:#111">
        <h2 style="margin:0 0 8px">New Contact Form Message</h2>
        <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:12px 0 4px"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap; background:#f7f7f8; padding:12px; border-radius:8px">${escapeHtml(message)}</div>
      </div>
    `;

    // Use Resend v4 SDK
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: ["sadhukhankalyan21@gmail.com"],
      subject,
      html,
      reply_to: email,
    });

    if (error) {
      // Handle common domain/verification errors with a cleaner message
      const rawMessage = error?.message || String(error);
      console.error("Resend send error:", rawMessage);

      const knownDomainIssue = /domain|verify|unauthorized|forbidden|blocked/i.test(rawMessage);
      const message = knownDomainIssue
        ? "Email service is not fully configured (domain or recipient not verified). Please verify your Resend setup."
        : rawMessage;

      return sendJson(res, 502, { success: false, error: message });
    }

    return sendJson(res, 200, {
      success: true,
      message: "Email sent successfully",
      id: data?.id || null,
    });
  } catch (err) {
    console.error("Unexpected server error while sending email:", err);
    return sendJson(res, 500, {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}

// Minimal HTML escaping for safe rendering
function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
