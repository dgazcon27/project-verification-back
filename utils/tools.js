const path = require("path");
const fs = require("fs");

function getFolderPath(folder = "") {
  const rootFolder = process.env.FOLDER_UPLOAD;
  return path.join(path.dirname(__dirname), rootFolder, folder);
}

function createFolder(folderPath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(folderPath)) {
        fs.mkdir(folderPath, (err) => {
          if (err) {
            reject(err);
          }
          console.log("Directory created successfully!");
          resolve();
        });
      }
      resolve();
    });
  }

module.exports = {
  getFolderPath,
  createFolder
};
