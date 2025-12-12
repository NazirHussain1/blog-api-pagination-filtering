import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
