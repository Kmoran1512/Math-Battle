$('#page-head')[0].style.backgroundColor = "grey";

$('#page-head').append(`

    <meta name="authors" content="Chris Cui, Kyle Moran & Rachel Woodall">
    <meta name="description" content="A game designed to help teach children and audults
        who have trouble learning math to learn in a fun and interactive way.">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="./css/style-style.css">
`);

$('#page-tail').append(`

    <script src="./atom.js"></script>

    <script>
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
    </script>
`)
