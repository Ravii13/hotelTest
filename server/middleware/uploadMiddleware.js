import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}) // Store files in memory
});




export default upload



