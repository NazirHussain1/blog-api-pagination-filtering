import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  await connectDB();

  try {
    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

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
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
