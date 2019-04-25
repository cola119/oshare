const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

const myfunctions = {
    // writeUrl: './src/writeUrl',
    generateThumbnail: './src/generateThumbnail',
    writeUserInfo: './src/writeUserInfo',
};

loadFunctions = (functions) => {
    for (let name in functions) {
        if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
            exports[name] = require(functions[name]);
        }
    }
};

loadFunctions(myfunctions);