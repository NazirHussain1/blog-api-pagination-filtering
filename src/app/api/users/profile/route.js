import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connectDB();

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find user by ID
    const user = await User.findById(userId).select(
      "name email phone location about avatar role createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// Update profile
export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const { name, email, phone, location, about, avatar } = body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, location, about, avatar },
      { new: true, runValidators: true }
    ).select("name email phone location about avatar role createdAt");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
