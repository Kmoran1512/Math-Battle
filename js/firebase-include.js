
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.DOMAIN,
    databaseURL: config.DATA_URL,
    projectId: config.P_ID,
    storageBucket: config.BUCKET,
    messagingSenderId: config.SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
