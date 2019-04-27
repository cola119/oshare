const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = functions.auth.user().onCreate((user) => {
    const disabled = user.disabled;
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const metadata = user.metadata;
    const photoURL = user.photoURL;
    const providerData = user.providerData;
    const uid = user.uid;
    const data = {
        disabled,
        displayName,
        email,
        emailVerified,
        // metadata,
        photoURL,
        // providerData,
        uid,
        created_at: Date.now()
    }
    console.log(data)
    admin.firestore().collection("users").doc(`${uid}`).set(data).then(() => {
        console.log("wrote");
        return 0;
    }).catch((error) => {
        console.error("Error writing document: ", error);
        return 1;
    });
});