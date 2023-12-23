const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv"); // Import dotenv for loading environment variables

// Load environment variables from .env file
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dseehwbwx",
  api_key: process.env.CLOUDINARY_API_KEY || "336774723899658",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "DM_b7aysW_kACTXHWN8b6LCN_X4",
});

const uploadOnCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer || !fileBuffer.length) {
      throw new Error("Invalid file buffer");
    }

    // Upload file to cloudinary storage
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("File upload failed"));
            } else {
              console.log("File upload successful 🌨️..", result.url);
              resolve(result);
            }
          }
        )
        .end(fileBuffer);
    });

    return response; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

module.exports = uploadOnCloudinary;
