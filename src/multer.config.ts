export async function uploadImagesToMongo(files: Array<Express.Multer.File>) {
  const images = files.map((file) => ({
    originalname: file.originalname,
    mimetype: file.mimetype,
    data: file.buffer, // Store as Binary data
  }));

  return images; // This will be saved directly to MongoDB in the `book` document
}
