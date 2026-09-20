"use server";

import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Skorex <onboarding@resend.dev>";

// Emails a student's exam login credentials. Requires RESEND_API_KEY to be set
// and (for delivery to any address other than the Resend account owner's own
// inbox) the sending domain verified in the Resend dashboard.
export async function sendStudentCredentialsEmail(student, centerName) {
  if (!student.email) return { ok: false, error: "No email on file for this student." };
  if (!process.env.RESEND_API_KEY) return { ok: false, error: "Email sending is not configured yet." };

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: student.email,
      subject: `Your ${centerName} exam login`,
      html: `
        <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #16132b;">
          <h2 style="margin-bottom: 4px;">Welcome, ${student.name}!</h2>
          <p style="color: #5c5675;">${centerName} has enrolled you on Skorex. Here's your exam login:</p>
          <table style="margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 16px 6px 0; color: #948fab;">Center</td>
              <td style="padding: 6px 0; font-weight: 700;">${centerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 16px 6px 0; color: #948fab;">Phone (login ID)</td>
              <td style="padding: 6px 0; font-weight: 700;">${student.phone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 16px 6px 0; color: #948fab;">Password</td>
              <td style="padding: 6px 0; font-weight: 700;">${student.password}</td>
            </tr>
          </table>
          <a href="https://skorex.in/login" style="display: inline-block; background: #5433e0; color: #fff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 700;">
            Log in at skorex.in
          </a>
        </div>
      `,
    });
    if (error) return { ok: false, error: error.message || "Could not send email." };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || "Could not send email." };
  }
}
