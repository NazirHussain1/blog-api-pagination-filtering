import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    await connectDB();

    const params = await context.params; // ✅ unwrap Promise
    const userIdToFollow = params.id;

    const { currentUserId } = await req.json();

    if (!currentUserId)
      return NextResponse.json({ error: "Current user ID required" }, { status: 400 });

    if (userIdToFollow === currentUserId)
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Toggle follow
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(userIdToFollow);
    } else {
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
      currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToFollow);
    }

    await userToFollow.save();
    await currentUser.save();

    return NextResponse.json({ message: "Follow status updated" });
  } catch (error) {
    console.error("Follow API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
