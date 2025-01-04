import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Configure FilesInterceptor
@UseInterceptors(
  FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './public/uploads', // Ensure this folder exists
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname); // Get the file extension
        const filename = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
        console.log(`Saving file: ${file.originalname} as ${filename}`); // Debugging
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!/(jpg|jpeg|png|gif)$/.test(file.mimetype)) {
        console.error(`Invalid file type: ${file.mimetype}`);
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }),
)
