//Guest in Button Logic
{
    var guestin = (event) => {
        console.log('hi')
        firebase.auth().signInAnonymously()
    };

    $(document).on('click', '#idx-btn-guest', guestin)

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = 'html/home.html';
        } else {
            console.log("not in")
        }
    });
}