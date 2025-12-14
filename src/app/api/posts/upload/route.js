import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  try {
    // Support multipart/form-data
    const formData = await req.formData();
    const file = formData.get("image"); // must match frontend key

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts", use_filename: true, unique_filename: false },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

    const result = await streamUpload(buffer);
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
