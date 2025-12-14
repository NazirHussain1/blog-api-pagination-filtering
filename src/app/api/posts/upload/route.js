import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";
import streamifier from "streamifier";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blog_posts",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
