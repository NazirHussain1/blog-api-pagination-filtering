import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, context) {
  try {
    await connectDB();

    const params = await context.params; // ✅ unwrap Promise
    const userIdToFollow = params.id;

    console.log("Follow request for user:", userIdToFollow);

    // Get current user from JWT token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUserId = decoded.id;
    console.log("Current user ID:", currentUserId);

    if (userIdToFollow === currentUserId) {
      console.log("User trying to follow themselves");
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      console.log("User not found:", { userToFollow: !!userToFollow, currentUser: !!currentUser });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Users found, proceeding with follow toggle");

    // Toggle follow
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(userIdToFollow);
      console.log("Added follow");
    } else {
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
      currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToFollow);
      console.log("Removed follow");
    }

    await userToFollow.save();
    await currentUser.save();

    console.log("Follow operation completed successfully");
    return NextResponse.json({ message: "Follow status updated" });
  } catch (error) {
    console.error("Follow API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
