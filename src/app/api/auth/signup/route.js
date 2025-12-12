import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password, role } = await req.json(); // role explicitly

    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user", // fallback if frontend didn’t send role
    });

    return NextResponse.json({
      msg: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
