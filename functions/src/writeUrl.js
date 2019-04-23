const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');

// 削除時も
module.exports = functions.storage.object().onFinalize((object) => {
    console.log(object);
    const uid = object.metadata.uid;
    const showName = object.metadata.showName;
    const bucketName = object.bucket;
    const filePath = object.name;
    const fileName = path.basename(filePath);
    const contentType = object.contentType;
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`
    const downloadThumbnailUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/thumb_${encodeURIComponent(filePath)}?alt=media`
    const created_at = object.timeStorageClassUpdated;
    admin.firestore().collection(`images`).add({
        uid,
        contentType,
        filePath,
        fileName,
        showName,
        downloadUrl,
        downloadThumbnailUrl,
        created_at,
    }).then(() => {
        console.log("wrote");
        return 0;
    }).catch((error) => {
        console.error("Error writing document: ", error);
        return 1;
    });
});