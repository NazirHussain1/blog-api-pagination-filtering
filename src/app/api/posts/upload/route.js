import cloudinary from "@/utils/cloudinary";
import multer from "multer";
import nextConnect from "next-connect";
import streamifier from "streamifier";


const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Cloudinary using a stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts", use_filename: true, unique_filename: false },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default handler;
