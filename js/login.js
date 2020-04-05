//Submit Login Button Logic
{
    var login = (event) => {
        var userEmail = $('#txt-login-email')[0].value;
        var userPass = $('#txt-login-pass')[0].value;

        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error: " + errorMessage);
        });

    };

    $(document).on('click', '#btn-login', login)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = '../html/home.html';
        } else {
            console.log("not in")
        }
    });
}

//User Login

