export const firebaseConfig = ((nodeEnv, projectId) => {
    // console.log(nodeEnv, process.env);
    if (nodeEnv === 'production' && projectId === 'o-app-12a70') {
        console.log('production');
        return {
            apiKey: "AIzaSyA386LCZOVHR0iGmR-M2UfFLb6UF--UfAc",
            authDomain: "o-app-12a70.firebaseapp.com",
            databaseURL: "https://o-app-12a70.firebaseio.com",
            projectId: "o-app-12a70",
            storageBucket: "o-app-12a70.appspot.com",
            messagingSenderId: "594498287442"
        }
    } else {
        console.log('staging');
        return {
            apiKey: "AIzaSyAEo3nCDsV891roCyrx0x-u6nP8CeKOE_o",
            authDomain: "oshare-development.firebaseapp.com",
            databaseURL: "https://oshare-development.firebaseio.com",
            projectId: "oshare-development",
            storageBucket: "oshare-development.appspot.com",
            messagingSenderId: "715933878959"
        }
    }
})(process.env.NODE_ENV, process.env.REACT_APP_PROJECT_ID);



/*
export const firebaseConfig = {
    apiKey: "AIzaSyA386LCZOVHR0iGmR-M2UfFLb6UF--UfAc",
    authDomain: "o-app-12a70.firebaseapp.com",
    databaseURL: "https://o-app-12a70.firebaseio.com",
    projectId: "o-app-12a70",
    storageBucket: "o-app-12a70.appspot.com",
    messagingSenderId: "594498287442"
};
var config = {
    apiKey: "AIzaSyAEo3nCDsV891roCyrx0x-u6nP8CeKOE_o",
    authDomain: "oshare-development.firebaseapp.com",
    databaseURL: "https://oshare-development.firebaseio.com",
    projectId: "oshare-development",
    storageBucket: "oshare-development.appspot.com",
    messagingSenderId: "715933878959"
  };
*/