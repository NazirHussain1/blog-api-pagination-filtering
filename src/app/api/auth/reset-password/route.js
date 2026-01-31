import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const { email, resetCode, newPassword } = await req.json();

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      resetPasswordCode: resetCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordCode = undefined;
    await user.save();

    return NextResponse.json({
      message: "Password reset successful"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}