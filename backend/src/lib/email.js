// backend/src/lib/email.js
import { ENV } from '../config/env.js'
import { createTransport } from 'nodemailer'

const transporter = createTransport({
  host:   ENV.SMTP_HOST,
  port:   Number(ENV.SMTP_PORT),
  secure: Number(ENV.SMTP_PORT) === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
})

// ── OTP verification email ────────────────────────────────────────────────────

export async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from:    ENV.SMTP_FROM,
    to:      email,
    subject: 'Your Job Trackly verification code',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Verify your email</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">
          Use the code below to complete your Job Trackly sign up.
          It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#fff;border:2px solid #2f54c8;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#2f54c8;">${otp}</span>
        </div>
        <p style="margin:0;color:#9ca3af;font-size:13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

// ── Follow-up reminder email ──────────────────────────────────────────────────
// apps: Array<{ company: string, role: string, status: string, daysSince: number }>

export async function sendFollowUpReminderEmail(email, firstName, apps) {
  const STATUS_STYLE = {
    Applied:    { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
    Assessment: { bg: '#faf5ff', text: '#7e22ce', dot: '#a855f7' },
    Interview:  { bg: '#f0fdfa', text: '#0f766e', dot: '#14b8a6' },
    Saved:      { bg: '#f9fafb', text: '#4b5563', dot: '#9ca3af' },
  }

  const appRows = apps.map((a) => {
    const s = STATUS_STYLE[a.status] || STATUS_STYLE.Saved
    return `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #f3f4f6;">
          <div style="font-weight:700;color:#111827;font-size:14px;">${a.company}</div>
          <div style="color:#6b7280;font-size:13px;margin-top:2px;">${a.role}</div>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f3f4f6;text-align:center;">
          <span style="display:inline-flex;align-items:center;gap:5px;background:${s.bg};color:${s.text};font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;">
            <span style="width:6px;height:6px;border-radius:50%;background:${s.dot};flex-shrink:0;display:inline-block;"></span>
            ${a.status}
          </span>
        </td>
        <td style="padding:14px 16px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280;font-size:13px;white-space:nowrap;">
          ${a.daysSince} day${a.daysSince !== 1 ? 's' : ''} ago
        </td>
      </tr>
    `
  }).join('')

  const count  = apps.length
  const plural = count === 1 ? 'application needs' : 'applications need'

  await transporter.sendMail({
    from:    ENV.SMTP_FROM,
    to:      email,
    subject: `⏰ ${count} job ${plural} a follow-up — Job Trackly`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
        <div style="max-width:560px;margin:40px auto;padding:0 16px 40px;">

          <!-- Header bar -->
          <div style="background:#2f54c8;border-radius:16px 16px 0 0;padding:24px 32px;display:flex;align-items:center;gap:14px;">
            <div style="background:rgba(255,255,255,0.18);border-radius:10px;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">💼</div>
            <div>
              <div style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-0.3px;">Job Trackly</div>
              <div style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:2px;">Follow-up Reminder</div>
            </div>
          </div>

          <!-- Body card -->
          <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;">

            <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;letter-spacing:-0.4px;">
              Hey ${firstName || 'there'} 👋
            </h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.65;">
              You have <strong style="color:#111827;">${count} application${count !== 1 ? 's' : ''}</strong>
              that ${plural} your attention. A quick follow-up can significantly improve your chances.
            </p>

            <!-- Applications table -->
            <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:28px;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;">Company / Role</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;">Status</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#9ca3af;">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  ${appRows}
                </tbody>
              </table>
            </div>

            <!-- CTA button -->
            <div style="text-align:center;margin-bottom:28px;">
              <a href="${ENV.CLIENT_URL}/applications"
                style="display:inline-block;background:#2f54c8;color:#fff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:-0.2px;">
                View My Applications →
              </a>
            </div>

            <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;">

            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;text-align:center;">
              You're receiving this because you enabled follow-up reminders in
              <a href="${ENV.CLIENT_URL}/settings" style="color:#2f54c8;text-decoration:none;">Settings</a>.
              To stop these emails, turn off reminders in your notification preferences.
            </p>

          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendPasswordResetEmail(email, otp) {
  await transporter.sendMail({
    from:    ENV.SMTP_FROM,
    to:      email,
    subject: 'Reset your Job Trackly password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Reset your password</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">
          Use the code below to reset your Job Trackly password.
          It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#fff;border:2px solid #dc2626;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#dc2626;">${otp}</span>
        </div>
        <p style="margin:0 0 12px;color:#6b7280;font-size:14px;">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will not be changed.
        </p>
        <p style="margin:0;color:#9ca3af;font-size:13px;">— The Job Trackly Team</p>
      </div>
    `,
  })
}