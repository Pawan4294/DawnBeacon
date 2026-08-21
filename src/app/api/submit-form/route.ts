import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getRecommendation } from "@/logic/matchEngine";
import { evaluateHardwareFactors } from "@/logic/hardwareFactors";
import { DAWN_LINKS } from "@/data/dawnFacts";

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

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || smtpUser;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Rebuild the full recommendation + hardware factors here, server-side,
      // using the same deterministic logic as the app — nothing stored, nothing
      // re-read from Neon, computed fresh from the submitted answers only.
      const matchResult = getRecommendation({ rooftopAccess: Boolean(rooftopAccess), propertyType, nearbyDensity, interest });
      const hardwareFactors = evaluateHardwareFactors({ rooftopAccess: Boolean(rooftopAccess), propertyType, nearbyDensity, interest });

      const factorRows = (label: string, factors: typeof hardwareFactors.blackBox.factors) =>
        factors
          .filter((f) => f.applies)
          .map((f) => `<li>${f.name}</li>`)
          .join("");

      try {
        await transporter.sendMail({
          from: fromEmail,
          to: email,
          subject: "Your DawnBeacon Check My Fit Result",
          html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #E96C38;">Your DawnBeacon Result</h2>
              <p>Hi ${name},</p>
              <p>Thank you for using DawnBeacon — an independent, unofficial community tool for exploring DAWN Internet.</p>

              <div style="background:#f7f2ee; border-left:4px solid #E96C38; padding:12px 16px; margin:16px 0;">
                <p style="margin:0;"><strong>Recommendation:</strong> ${matchResult.recommendation} (${matchResult.confidence} confidence)</p>
                <p style="margin:8px 0 0;">${matchResult.reason}</p>
              </div>

              <h3 style="color:#E96C38; font-size:15px;">Black Box — ${hardwareFactors.blackBox.fitLabel}</h3>
              <ul style="font-size:13px; color:#444;">${factorRows("blackBox", hardwareFactors.blackBox.factors) || "<li>No matching factors for this profile</li>"}</ul>
              <p><a href="${DAWN_LINKS.blackBoxStore}" style="color:#E96C38;">Buy Black Box →</a></p>

              <h3 style="color:#E96C38; font-size:15px;">Antenna / Deployer — ${hardwareFactors.antenna.fitLabel}</h3>
              <ul style="font-size:13px; color:#444;">${factorRows("antenna", hardwareFactors.antenna.factors) || "<li>No matching factors for this profile</li>"}</ul>
              <p><a href="${DAWN_LINKS.deployerForm}" style="color:#E96C38;">Apply for Antenna →</a></p>

              <hr style="border-color: #E96C38; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888;">
                DawnBeacon is an independent, unofficial community tool. Not affiliated with or endorsed by DAWN Internet.
                All reward mechanics shown trace to DAWN's published blog posts and whitepaper. Hardware reward amounts
                are not published as a specific formula — qualitative factors only are shown.
                <br/><br/>
                You received this email because you submitted the Check My Fit form and consented to contact.
                To request data deletion, reply to this email.
              </p>
            </div>`,
        });
      } catch (emailErr) {
        console.error("Gmail SMTP send failed:", emailErr);
      }
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