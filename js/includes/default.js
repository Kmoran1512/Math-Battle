$('#page-head')[0].style.backgroundColor = "grey";

$('#page-head').append(`
    <meta charset="utf-8">

    <meta name="authors" content="Chris Cui, Kyle Moran & Rachel Woodall">
    <meta name="description" content="A game designed to help teach children and audults
        who have trouble learning math to learn in a fun and interactive way.">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="../css/style-style.css">
`);

$('#head-nav-bar').append(`
    <nav class="navbar navbar-default" role="navigation" aria-label="main navigation">
        <div class="container-fluid">

            <div class="navbar-header" aria-label="link to about us">
                <a class="navbar-brand" href="about.html" style="color: white">Math Battle</a>
            </div>

            <ul class="nav navbar-nav">
                <li><a href="home.html">Home</a></li>
                <li><a href="compendium.html">Compendium</a></li>
                <li><a href="explain.html">How to Play</a></li>
                <li><a href="math_page.html">Math!</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right" role="navigation" aria-label="account navigation">
                <li><a href="account.html" class="p-username"><span class="glyphicon glyphicon-user"></span></a></li>
                <li><a href='.' id="log-out">  Logout  <span class="glyphicon glyphicon-log-in"></span></a></li>
            </ul>

        </div>
    </nav>
`);

$('#page-tail').append(`

    <script src="../atom.js"></script>

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
