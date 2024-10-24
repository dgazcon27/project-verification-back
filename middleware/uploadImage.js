const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { getFolderPath, createFolder } = require("../utils/tools");

const folder = getFolderPath();

const multerFilter = (req, file, cb) => {
  const type =file.mimetype.split("/")[1];
  if (['png', 'jpeg', 'jpg'].includes(type)) {
    cb(null, true);
  } else {
    console.log("Error cargando imagen");
    console.log(`Type file: ${type} not allowed`);
    cb(new Error(`Type file: ${type} not allowed`), false);
  }
};

var storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Uploads is the Upload_folder_name
    const { username } = req.body;
    const folderPath = path.join(folder, username);
    console.log(folderPath);
    await createFolder(folderPath);
    cb(null, folderPath);
  },
  filename: async function (req, file, cb) {
    const { username } = req.body;
    console.log(`Body receive: ${JSON.stringify(req.body)}`);
    const ext = file.mimetype.split("/")[1];
    const nameFile = `${username}-${Date.now()}.${ext}`;
    req.filename = nameFile;
    console.log("filename :", nameFile);
    cb(null, nameFile);
  },
});

const upload = multer({ storage, fileFilter: multerFilter, }).single("image");

module.exports = { upload };
