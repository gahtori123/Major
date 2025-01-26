import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const upload = multer({
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '../uploads'),
        filename: (_req, file, cb) => {
            const uniqueName = `${uuidv4()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    }),
});

export default upload;
