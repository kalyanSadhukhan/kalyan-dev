// api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).json({ success: true }); // <-- changed
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const result = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: ["sadhukhankalyan21@gmail.com"],
      subject: `New Contact Form Message from ${name}`,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
      replyTo: email,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" }); // always JSON
  }
}
