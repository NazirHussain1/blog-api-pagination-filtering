import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function POST(req) {
  await connectDB();
  try {
    const { name, email, password } = await req.json();

    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json({ msg: "Email already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json({ msg: "User created", user });
  } catch (err) {
    return NextResponse.json({ msg: "Error", err: err.message }, { status: 500 });
  }
}
