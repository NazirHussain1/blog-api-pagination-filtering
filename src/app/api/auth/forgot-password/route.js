import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import crypto from "crypto";

export async function POST(req) {
  await connectDB();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration time (15 minutes)
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save reset token and code to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    user.resetPasswordCode = resetCode;
    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the code (remove this in production)
    console.log(`Reset code for ${email}: ${resetCode}`);

    // Simulate email sending
    const emailSent = await sendResetEmail(email, resetCode, user.name);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Reset code sent to your email",
      // Remove this in production - only for testing
      resetCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock email sending function
async function sendResetEmail(email, resetCode, userName) {
  try {
    // In production, integrate with email service like:
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    // - Resend
    
    console.log(`
    ===== PASSWORD RESET EMAIL =====
    To: ${email}
    Subject: Password Reset Code - InsightHub
    
    Hi ${userName},
    
    Your password reset code is: ${resetCode}
    
    This code will expire in 15 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    InsightHub Team
    ================================
    `);
    
    return true; // Simulate successful email sending
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}