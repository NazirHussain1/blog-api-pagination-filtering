import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  console.log("=== AVATAR UPLOAD ROUTE CALLED ===");
  
  try {
    // Check authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("No authentication token found");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      console.log("Authentication successful");
    } catch (err) {
      console.log("Invalid authentication token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    console.log("Parsing form data...");
    const formData = await req.formData();
    
    console.log("Getting avatar file...");
    const file = formData.get("avatar");
    
    console.log("File received:", !!file);
    if (file) {
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
    }

    if (!file || file.size === 0) {
      console.log("ERROR: No file uploaded or file size is 0");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Convert file to buffer
    console.log("Converting file to buffer...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Uploading to Cloudinary...");

    // Upload to Cloudinary in "avatars" folder
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    console.log("Avatar upload successful:", uploadResult.secure_url);
    return NextResponse.json({ url: uploadResult.secure_url });
    
  } catch (error) {
    console.error("=== AVATAR UPLOAD ERROR ===", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}
