import User from "@/app/models/User";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await connectDB();

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
      "name email phone location about avatar socialLinks role createdAt"
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
  await connectDB();

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let body;
    const contentType = req.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData
      const formData = await req.formData();
      body = {
        name: formData.get("name"),
        email: formData.get("email"),
        location: formData.get("location"),
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        avatar: formData.get("avatar"),
        socialLinks: formData.get("socialLinks") ? JSON.parse(formData.get("socialLinks")) : undefined
      };
    } else {
      // Handle JSON
      body = await req.json();
    }

    const { name, email, phone, location, about, avatar, coverImage, socialLinks, education, work, hobbies, skills, currentPassword, newPassword } = body;

    console.log("Profile update request:", { 
      name, email, phone, location, about, 
      avatar: !!avatar, 
      coverImage: !!coverImage,
      socialLinks: !!socialLinks,
      education: !!education,
      work: !!work,
      hobbies: !!hobbies,
      skills: !!skills
    });

    // Handle password change
    if (currentPassword && newPassword) {
      const user = await User.findById(userId);
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user
    const updateData = { name, email, phone, location, about };
    if (avatar) updateData.avatar = avatar;
    if (coverImage) updateData.coverImage = coverImage;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (education) updateData.education = education;
    if (work) updateData.work = work;
    if (hobbies) updateData.hobbies = hobbies;
    if (skills) updateData.skills = skills;
    if (body.password) updateData.password = body.password;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("name email phone location about avatar coverImage socialLinks education work hobbies skills role createdAt");

    console.log("User updated successfully, avatar:", updatedUser.avatar, "coverImage:", updatedUser.coverImage);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error", details: error.message },
      { status: 500 }
    );
  }
}
