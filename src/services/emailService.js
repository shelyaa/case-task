import {Resend} from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendConfirmationEmail = async (email, confirmToken) => {
  const confirmUrl = `${process.env.BASE_URL}/api/confirm/${confirmToken}`;

  await resend.emails.send({
    from: "GitHub Release Tracker <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your subscription",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff;">
        <div style="background: #0d1117; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <span style="color: #f0f6fc; font-size: 15px; font-weight: 500;">GitHub Release Tracker</span>
        </div>
        <div style="padding: 32px 24px; border: 1px solid #e1e4e8; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #24292f;">Confirm your subscription</h2>
          <a href="${confirmUrl}"
             style="display: inline-block; background: #238636; color: #ffffff; font-size: 14px; font-weight: 500; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
            Confirm subscription
          </a>
          <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 24px 0;">
          <p style="font-size: 12px; color: #8c959f; line-height: 1.6; margin: 0;">
            If you didn't request this, you can safely ignore this email — no changes will be made.
            This link expires in 24 hours.
          </p>
        </div>
      </div>
    `,
  });
};

export const sendReleaseNotification = async (email, repo, tag) => {
  const releaseUrl = `https://github.com/${repo}/releases/tag/${tag}`;

  await resend.emails.send({
    from: "GitHub Release Tracker <onboarding@resend.dev>",
    to: email,
    subject: `New release ${tag} in ${repo}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff;">
        <div style="background: #0d1117; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <span style="color: #f0f6fc; font-size: 15px; font-weight: 500;">GitHub Release Tracker</span>
        </div>
        <div style="padding: 32px 24px; border: 1px solid #e1e4e8; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 600; color: #24292f;">New release available</h2>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #161b22; border: 1px solid #30363d; border-radius: 20px; padding: 4px 12px; margin-bottom: 12px;">
            <span style="font-size: 13px; color: #f0f6fc;">${tag}</span>
          </div>
          <p style="margin: 0 0 24px; font-size: 14px; color: #57606a;">
            Repository: <a href="https://github.com/${repo}" style="color: #0969da; text-decoration: none;">${repo}</a>
          </p>
          <a href="${releaseUrl}"
             style="display: inline-block; background: #1f6feb; color: #ffffff; font-size: 14px; font-weight: 500; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
            View release notes
          </a>
          <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 24px 0;">
          <p style="font-size: 12px; color: #8c959f; line-height: 1.6; margin: 0;">
            You're receiving this because you subscribed to release notifications for this repository.
          </p>
        </div>
      </div>
    `,
  });
};
