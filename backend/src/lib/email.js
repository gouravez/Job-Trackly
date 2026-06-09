import nodemailer from 'nodemailer'
import { ENV } from '../config/env.js'

const transporter = nodemailer.createTransport({
  host:   ENV.SMTP_HOST,
  port:   Number(ENV.SMTP_PORT),
  secure: Number(ENV.SMTP_PORT) === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
})

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