var test = "Hello World!"
var currentUser;
var userRef;
var userData;

document.addEventListener("DOMContentLoaded", event =>{
    console.log("User stuff is running");
    checkForUser();
});

/**
 * Gets the user's data, makes new user if it currently doesn't exist
 */
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

 /**
  * Updates the user's data
  */
 function setUserData()
 {
     db.collection("Users").doc(currentUser.uid).update(userData);
 }

 /**
  * Removes the given team from the list
  */
 function removeFromTeamList(team)
 {
     var i = userData.teamList.indexOf(team);
     userData.teamList.splice(i, 1);
 }
 
 /**
  * Logs in the user
  */
 function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult()
                .then(result => {
                    console.log("signed in");
                    currentUser = result.user;
                    loginToggle();
                })
                .catch(err =>{
                    console.log(err);
                });
        })
 }

 /**
  * Signs out the user
  */
 function googleLogout()
 {
     firebase.auth().signOut().then(function () {
         console.log('Signed Out');
         currentUser = null;
         loginToggle();
     }, function (error) {
         console.error('Sign Out Error', error);
     });
 }

 /**
  * Toggles between the sign in or sign out, depending on if currentUser exists
  */
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

 /**
  * Checks if user is signed in and gets data.
  */
 function checkForUser()
 {
     firebase.auth().onAuthStateChanged(async function (user) {
       
         if (user) {
            // User is signed in.
             currentUser = user;
            loginToggle();
            console.log(user.displayName + "is signed in");
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