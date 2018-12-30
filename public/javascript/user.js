var test = "Hello World!"
var currentUser;
var userRef;
var userData;

document.addEventListener("DOMContentLoaded", event =>{
    console.log("User stuff is running");
    


  //  $('#signIn').on("click", googleLogin);
    $('#signOut').on("click", googleLogout);
    userSignedIn();
});

 async function getUserRef()
 {
     userRef = db.collection("Users").doc(currentUser.uid);
    await userRef.get()
     .then(async snap => {
         if(!snap.exists)
        {
            console.log("User currently not in database");
            var emptyData = getEmptyUserData()

            userRef.set(emptyData);
            getUserRef();
        }
        else
            userData = await snap.data();
     })
 }
 function setUserData()
 {
     db.collection("Users").doc(currentUser.uid).update(userData);
 }

 function removeFromTeamList(team)
 {
     var i = userData.teamList.indexOf(team);
     userData.teamList.splice(i, 1);
 }
 
 function googleLogin() {
    console.log("Clicked");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
            console.log("Set persistence thing");
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult()
                .then(result => {
                    console.log("signed in");
                    var token = result.credential.accessToken;
                    console.log(token);
                    const user = result.user;
                    currentUser = user;
                    loginToggle();
                })
                .catch(err =>{
                    console.log(err);
                  
                });
        })
 }

 function googleLogout()
 {
     console.log("Running logout");
     firebase.auth().signOut().then(function () {
         console.log('Signed Out');
         currentUser = null;
         loginToggle();
     }, function (error) {
         console.error('Sign Out Error', error);
     });
 }

 function loginToggle()
 {
     if(currentUser)
     {
         console.log("Switching to sign out");
        $('#signIn').text("Sign Out");
        $('#signIn').attr('id', 'signOut');
         $('#signOut').on("click", googleLogout);
     }
    else
    {
         console.log("Switching to sign in");
        $('#signOut').text("Sign In");
        $('#signOut').attr('id', 'signIn');
         $('#signIn').on("click", googleLogin);
    }
 }

 function userSignedIn()
 {
     firebase.auth().onAuthStateChanged(async function (user) {
       
         if (user) {
             // User is signed in.
             currentUser = user;
            loginToggle();
             var displayName = user.displayName;
             var email = user.email;
             var emailVerified = user.emailVerified;
             var photoURL = user.photoURL;
             var isAnonymous = user.isAnonymous;
             var uid = user.uid;
             var providerData = user.providerData;
             console.log(displayName + "is signed in");
             if (userData == null)
             await getUserRef();

         } else {
           console.log("USER IS SIGNED OUT");
             currentUser = user;
            loginToggle();
         }
         //This code is to run for the My List page, this is so that the list is made after 
         //Checking if the user is signed in.
         if (document.location.pathname == "/list.html")
             makeUserList();
     });
 }