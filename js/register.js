
//Guest in Button Logic
{
    var guestin = (event) => {
        console.log('hi')
        firebase.auth().signInAnonymously()
    };

    $(document).on('click', '#regi-btn-guest', guestin)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = '../html/home.html';
        } else {
            console.log("not in")
        }
    });
}

//Submit Register Button Logic
{
    var register = (event) => {
        event.preventDefault()

        var userEmail = $('#txt-register-email')[0].value;
        var userPass = $('#txt-register-pass')[0].value;

        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            let utter = new SpeechSynthesisUtterance(errorMessage);
            speechSynthesis.speak(utter);
            
            //window.alert("Error: " + errorMessage);
        });

    };

    $(document).on('click', '#btn-register', register)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = '../html/home.html';
        } else {
            console.log("not in")
        }
    });
}