type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

type ApiResponse = {
  success: boolean;
  error?: string;
};

function getJsonBody(req: any): Partial<ContactPayload> {
  const body = req?.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as Partial<ContactPayload>;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    if (typeof res.setHeader === "function") {
      res.setHeader("Allow", "POST");
    }
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" } as ApiResponse);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ success: false, error: "Missing RESEND_API_KEY" } as ApiResponse);
  }

  try {
    const body = getJsonBody(req);
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" } as ApiResponse);
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "sadhukhankalyan21@gmail.com",
      subject: `Message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    // If the SDK returns an error object, surface it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const possibleError = (result as any)?.error;
    if (possibleError) {
      const errorMessage = typeof possibleError === "string" ? possibleError : possibleError?.message;
      return res
        .status(500)
        .json({ success: false, error: errorMessage || "Email sending failed" } as ApiResponse);
    }

    return res.status(200).json({ success: true } as ApiResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return res.status(500).json({ success: false, error: message } as ApiResponse);
  }
}
