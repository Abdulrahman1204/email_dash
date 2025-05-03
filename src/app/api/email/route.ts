import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

// الثوابت للبريد الإلكتروني
const EMAIL_SUBJECT = "COO Live Townhall - June 2024";
const BANNER_IMAGE_URL =
  "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
const LIVESTREAM_URL = "https://youtube.com/";
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
  LIVESTREAM_URL
)}`;

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json();

    // التحقق من صحة البريد الإلكتروني
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // إنشاء موصل نود ميلر
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML للبريد الإلكتروني مع الصورة وQR Code
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header-image { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .highlight { font-weight: bold; color: #2c3e50; }
            .footer { margin-top: 30px; font-size: 0.9em; color: #7f8c8d; }
            .qr-container { text-align: center; margin: 20px 0; }
            .qr-code { width: 150px; height: 150px; border: 1px solid #ddd; padding: 10px; background: white; }
            .livestream-link { display: block; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="${BANNER_IMAGE_URL}" alt="Townhall Event Banner" class="header-image" width="600">
            <h1>COO Live Townhall</h1>
            <h2>June 2024</h2>
        </div>

        <p>Dear COO Team and Business Partners,</p>

        <p>You are invited to join our <span class="highlight">COO Townhall Live Webcast</span> hosted by <span class="highlight">Ghada Al Jarbou</span>, Chief Operating Officer.</p>

        <div class="details">
            <p><strong>Date and Time:</strong><br>
            Sunday 30th June, 1:00 pm - 2:00pm</p>

            <p><strong>Location:</strong><br>
            In-Person: Second floor, Multipurpose Room SAB Tower<br>
            Live Streaming: Scan QR Code below or click the link</p>
            
            <div class="qr-container">
                <img src="${QR_CODE_URL}" alt="QR Code for Livestream" class="qr-code">
                <a href="${LIVESTREAM_URL}" class="livestream-link">${LIVESTREAM_URL}</a>
            </div>
        </div>

        <p><strong>Email Questions</strong> in advance or live during Event Q&A.</p>

        <div class="footer">
            <p>We look forward to your participation!</p>
        </div>
    </body>
    </html>
    `;

    console.log(to);

    // خيارات البريد الإلكتروني
    const mailOptions = {
      from: `"COO Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: EMAIL_SUBJECT,
      html: emailHtml,
      text: `COO Live Townhall - June 2024\n\nYou are invited to join our COO Townhall Live Webcast.\n\nDate: Sunday 30th June, 1:00 pm - 2:00pm\nLocation: Second floor, Multipurpose Room SAB Tower\nLive Stream: ${LIVESTREAM_URL}\n\nWe look forward to your participation!`,
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions, function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent: " + success.response);
      }
    });

    return NextResponse.json(
      { message: "Invitation email with QR code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send invitation email" },
      { status: 500 }
    );
  }
}
