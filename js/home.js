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

        pageLoaded();
        
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
const pageLoaded = () => {   
    if ($('#guest-or-user').length != 0) {
        if (firebase.auth().currentUser.isAnonymous) {
            $('#guest-or-user').append(`
                <div id='create-acc-from-guest' aria-label="guest creation" style="width: 75%;">

                    <h2> If you want to create an account from your guest account, do so below! </h2>

                    <div class="form-group">
                        <label for="txt-guest-reg-email"  id="email-label">Email address</label>
                        <input type="email" class="form-control" id="txt-guest-reg-email" aria-labelledby="email-label" placeholder="Enter email" tabindex="">
                    </div>

                    <div class="form-group">
                        <label for="txt-guest-reg-pass" id="pass-label">Password</label>
                        <input type="password" class="form-control" id="txt-guest-reg-pass" aria-labelledby="pass-label" placeholder="Password" tabindex="">
                    </div>

                    <button type="submit" class="btn btn-warning" id="btn-guest-reg" name="create-account-from-guest" tabindex="">Register</button>

                </div>
            `);

            let createAccFromGuest = (event) => {
                if (firebase.auth().currentUser.isAnonymous) {
                    var cred = firebase.auth.EmailAuthProvider.credential($('#txt-guest-reg-email')[0].value, $('#txt-guest-reg-pass')[0].value);

                    firebase.auth().currentUser.linkWithCredential(cred)
                    .then(function(usercred) {
                        var user = usercred.user;
                        console.log("Anonymous account successfully upgraded", user);
                    }).catch(function(error) {
                        alert("Error upgrading anonymous account", error);
                    });
                }
            }

            $(document).on('click', '#btn-guest-reg', createAccFromGuest);
        } else {
            $('#guest-or-user').append(`
            
                <div id='change-email-or-pass' aria-label="email and password change" style="width: 75%;">

                    <h2> If you need to change your password or delete your account you may do so below </h2>

                    <div>

                        <label for="txt-pass-reset" id="res-pass-lbl">Enter your email below</label>
                        <input type="email" class="form-control" id="txt-pass-reset" aria-labelledby="res-pass-lbl" placeholder="Email" tabindex="">

                        <br />
                        
                        <button type="submit" class="btn btn-dark" id="pass-reset" name="btn-res-acc" tabindex="">Reset Password</button>

                    </div>

                    <br /> <br />

                    <button type="button" class="btn btn-danger" id="del-acc" name="btn-del-acc" tabindex=""> Delete Account </button>

                </div>
            `);

            let passReset = (event) => {
                var auth = firebase.auth();
        
                auth.sendPasswordResetEmail($('#txt-pass-reset')[0].value).then(function() {
                    $('#change-email-or-pass').replaceWith(`
            
                        <div id='change-email-or-pass' aria-label="email and password change" style="width: 75%;">

                            <h3> Email Sent! </h3>

                        </div>
                    `);
                }).catch(function(error) {
                    alert(error)
                });

            }
        
            let deleteAccount = () => {
                var user = firebase.auth().currentUser;
        
                user.delete().then(function() {
                    logout(null);
                }).catch(function(error) {
                    alert(error)
                });
            }

            $(document).on('click', '#pass-reset', passReset);
            $(document).on('click', '#del-acc', deleteAccount);
        }
        
    }

}