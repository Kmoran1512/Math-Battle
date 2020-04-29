// Update page when log in loads
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        curr_user = user;
        loaded(curr_user)
    } else {
        window.location = '../index.html';
    }
});

// Display logged in username
var loaded = (user) => {

    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {

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

//Account Page
{   
    if (len($('#guest-or-user')) != 0) {

        
        
        $(document).on('click', '#create-acc-from-guest', createAccFromGuest)
    }

    let createAccFromGuest = (event) => {
        if (firebase.auth().currentUser.isAnonymous) {
            var cred = firebase.auth.EmailAuthProvider.credential(email, password);
            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(cred);
          }
    }

}