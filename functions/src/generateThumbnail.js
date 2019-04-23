const functions = require('firebase-functions');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

writeFirestore = (data) => {
    admin.firestore().collection(`images`).add(data)
        .then(() => console.log("wrote"))
        .catch((error) => console.error("Error writing document: ", error));
}

module.exports = functions.storage.object().onFinalize((async (object) => {
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;
    const metageneration = object.metageneration;
    if (!contentType.startsWith('image/')) return console.log('This is not an image.');
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    if (fileName.startsWith('thumb_')) return console.log('Already a Thumbnail.');

    const uid = object.metadata.uid;
    const showName = object.metadata.showName;
    const bucketName = object.bucket;
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`
    const thumbnailPath = `${dirName}/thumb_${fileName}`;
    const downloadThumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(thumbnailPath)}?alt=media`
    const created_at = object.timeStorageClassUpdated;
    const data = {
        uid,
        contentType,
        filePath,
        fileName,
        showName,
        downloadUrl,
        downloadThumbnailUrl,
        created_at,
    };
    writeFirestore(data);

    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
        contentType: contentType,
    };
    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log('Image downloaded locally to', tempFilePath);

    await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
    console.log('Thumbnail created at', tempFilePath);

    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

    await bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: metadata,
    });

    return fs.unlinkSync(tempFilePath);
}));