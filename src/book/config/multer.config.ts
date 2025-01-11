import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
      // Generate a unique suffix based on the current timestamp and random number
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      // Get the file extension
      const fileExt = extname(file.originalname);

      // Remove the extension from the original filename to use the base name.
      const baseName = file.originalname.split('.')[0];

      // Construct the final filename
      const filename = `files-${baseName}-${uniqueSuffix}${fileExt}`;
      callback(null, filename);
    },
  }),

  fileFilter: (req, file, callback) => {
    // Only allow image files
    if (!/(jpg|jpeg|png|gif)$/.test(file.mimetype)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};
