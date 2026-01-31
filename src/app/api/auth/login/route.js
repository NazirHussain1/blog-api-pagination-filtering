import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password, remember } = await req.json();
    console.log("Login attempt for email:", email);

    // Validate and sanitize inputs
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      console.log("Empty email or password after trimming");
      return NextResponse.json(
        { error: "Email and password cannot be empty" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(trimmedEmail)) {
      console.log("Invalid email format:", trimmedEmail);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.log("User not found for email:", trimmedEmail);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    console.log("User found, checking password...");
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", trimmedEmail);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    console.log("Login successful for user:", trimmedEmail);

    // remember → long session
    const expiresIn = remember ? "30d" : "1d";

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    const response = NextResponse.json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
