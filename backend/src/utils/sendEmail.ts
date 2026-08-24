import transporter from "../config/mail.js";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  otp?: string;
}

/**
 * Sends an email via the configured SMTP transporter.
 * If EMAIL_USER / EMAIL_PASS are not configured (common in local dev),
 * this falls back to logging the message (and OTP, if provided) to the
 * console so the app remains fully usable without real SMTP credentials.
 */
export const sendEmail = async ({ to, subject, html, otp }: MailOptions): Promise<void> => {
  const hasCredentials = !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;

  if (!hasCredentials) {
    console.log("\n===== DEV EMAIL FALLBACK (no EMAIL_USER/EMAIL_PASS set) =====");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (otp) console.log(`OTP: ${otp}`);
    console.log("================================================================\n");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send failed, falling back to console log:", error);
    if (otp) console.log(`OTP for ${to}: ${otp}`);
  }
};
