import fs from "fs";
import path from "path";

export const streamDownload = (filePath, res, originalName) => {
  try {
    console.log("Downloading local file:", filePath);

    // 🔥 convert to absolute path (VERY IMPORTANT)
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    res.download(absolutePath, originalName);
  } catch (error) {
    console.error("🔥 DOWNLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Download failed",
    });
  }
};