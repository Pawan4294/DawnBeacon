import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      propertyType,
      rooftopAccess,
      nearbyDensity,
      interest,
      recommendation,
      consent,
    } = body;

    // Validate required fields
    if (!name || !email || !propertyType || !nearbyDensity || !interest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: "Consent is required" },
        { status: 400 }
      );
    }

    // Store only consented fields — no phone number
    await db.insert(leads).values({
      name,
      email,
      propertyType,
      rooftopAccess: Boolean(rooftopAccess),
      nearbyDensity,
      interest,
      recommendation: recommendation || null,
      consentTimestamp: new Date(),
      createdAt: new Date(),
    });

    // Send confirmation email if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || "noreply@dawnbeacon.community";

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: "Your DawnBeacon Check My Fit Result",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E96C38;">Your DawnBeacon Result</h2>
            <p>Hi ${name},</p>
            <p>Thank you for using DawnBeacon — an independent, unofficial community tool for exploring DAWN Internet.</p>
            <p><strong>Your Fit Recommendation:</strong> ${recommendation || "See the app for your full result"}</p>
            <hr style="border-color: #E96C38; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">
              DawnBeacon is an independent, unofficial community tool. Not affiliated with or endorsed by DAWN Internet.
              All reward mechanics shown trace to DAWN's published blog posts and whitepaper.
              <br/><br/>
              You received this email because you submitted the Check My Fit form and consented to contact.
              To request data deletion, reply to this email.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("submit-form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
