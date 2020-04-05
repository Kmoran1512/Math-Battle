firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        curr_user = user;
        loaded(curr_user)
    } else {
      // No user is signed in.
    }
});

var loaded = (user) => {
    console.log('hi')

    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        console.log(user)

        if (user.isAnonymous) {
            var inn = 'guest : ' + $('.p-username')[0].innerHTML
            $('.p-username')[0].innerHTML = inn
        } else if (user.displayName != null) {
            var inn = user.displayName + ' : ' + $('.p-username')[0].innerHTML
            $('.p-username')[0].innerHTML = inn
        } else if (user.email != null) {
            var inn = user.email + ' : ' + $('.p-username')[0].innerHTML
            $('.p-username')[0].innerHTML = inn
        } else {
            var inn = 'Unknown User : ' + $('.p-username')[0].innerHTML
            $('.p-username')[0].innerHTML = inn
        }

        
    } else {
        console.log(user)
    }
} 

//Logout Button Logic
{
    var logout = (event) => {
    
        console.log("logout")

        firebase.auth().signOut().then(function() {
            window.location = '../index.html';
        }).catch(function(error) {
            alert("Error: " + error)
        });

    };

    $(document).on('click', '#log-out', logout)
}
