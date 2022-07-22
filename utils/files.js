const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const { env } = require("../config");
const fs = require("fs");
const serviceAccount = require("../firebase_service_keys.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${env.FIREBASE_BUCKET_NAME}.appspot.com`,
});

const bucket = getStorage().bucket();
/**
 *
 * @param  {Express.Multer.File[]} files
 * @param {import("@prisma/client").UploadType} type
 */
const uploadFiles = async (files, type) => {
    let urls = [];
    for (let i in files) {
        const reqFile = files[i];
        const fileExt = getExtension(reqFile);
        const newDestination = reqFile.path + "." + fileExt;
        fs.renameSync(reqFile.path, newDestination);
        const data = await bucket.upload(newDestination, {
            public: true,
            destination: `${type}/${reqFile.filename}.${fileExt}`,
        });
        const url = data[0].publicUrl();
        urls.push(url);
    }
    return urls;
};
/**
 *
 * @param {string[]} urls
 * @returns
 */
const removeFiles = async (urls) => {
    for (let i in urls) {
        const url = urls[i];
        let filename = url.split("/").pop();
        filename = filename.replace("%2F", "/");
        try {
            await bucket.deleteFiles({ prefix: filename });
        } catch (e) {
            console.log(e);
            return;
        }
    }
};
/**
 *
 * @param  {Express.Multer.File} file
 */
const getExtension = (file) => {
    const filename = file.mimetype;
    return filename.split("/")[1];
};
module.exports = { uploadFiles, removeFiles };
