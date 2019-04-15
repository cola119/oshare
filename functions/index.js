const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
admin.initializeApp()

// 削除時も
exports.writeUrl = functions.storage.object().onFinalize((object) => {
    console.log(object);
    const uid = object.metadata.uid;
    const bucketName = object.bucket;
    const filePath = object.name;
    const fileName = path.basename(filePath);
    const contentType = object.contentType;
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`
    const created_at = object.timeStorageClassUpdated;
    admin.firestore().collection(`images`).add({
        uid,
        contentType,
        filePath,
        fileName,
        downloadUrl,
        created_at,
    });
});