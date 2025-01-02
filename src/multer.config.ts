import { diskStorage } from 'multer';

// multer configuration
export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const name = file.originalname.split('.')[0];
      const fileExtension = file.originalname.split('.').pop();
      const newFileName = `${name.replace(/\s/g, '-')}-${Date.now()}.${fileExtension}`;
      cb(null, newFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error('Invalid file type. Only image files are allowed.'),
        false,
      );
    }
    cb(null, true);
  },
};
