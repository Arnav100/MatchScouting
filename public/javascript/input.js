var events;
var matches = [];
var team;
var scoutData;
var keys = [];
document.addEventListener("DOMContentLoaded", event => {

    console.log("running");
    console.log(test);
    $('#teamNumButton').on("click",  function(){
        if(!currentUser){
            $('#invalid').text("Need To Sign In to scout");
            $('#teamNum').addClass("is-invalid");
            return;
        }
        console.log("Fetching Data");
        var teamNum = $('#teamNum').val();
        team = db.collection("Teams").doc(teamNum);
        matches = [];
        keys = [];
        getChoices(teamNum);
    });
    $('#event').change(function () {
        displayMatches();
    });
    $('#match').change(function() {
        $('#form').removeClass('hidden');
        reset();
    });
    $(".field button").on("click", function(){
       
        var type = $(this).text();
        var input = $(this).parent().parent().find("input");
        var inputVal = $(input).val();
        if(type == "-" && inputVal != "0" )
            input.val(parseInt(inputVal) - 1);
        else if(type == "+")
            input.val(parseInt(inputVal) + 1);
    });
    $(".climbing").on("click", function(){
        climbedCheckboxes(this);
    } );
    $("#submit").on("click", async function(){
        var event = $('#event option:selected').text();
        var match = $('#match option:selected').text();
      await  team.collection(event).doc(match).get()
        .then(snap => {
          //  console.log(snap.data().auto);
            scoutData = snap.data();
            console.log(scoutData);
            var autoScale = parseInt($('#autoScale').val());
            var autoSwitch = parseInt($('#autoSwitch').val());
            addData(scoutData.auto.autoCubes.scale, autoScale);
            addData(scoutData.auto.autoCubes.switch, autoSwitch);
            addData(scoutData.auto.autoCubes.total, autoSwitch + autoScale);
            addData(scoutData.auto.autoLine, $("#autoLine").is(":checked"));
            addData(scoutData.auto.deadAuto, $("#deadAuto").is(":checked"));

            var teleScale = parseInt($('#teleScale').val());
            var teleSwitch = parseInt($('#teleSwitch').val());
            addData(scoutData.teleop.teleopCubes.scale, teleScale );
            addData(scoutData.teleop.teleopCubes.switch, teleSwitch);
            addData(scoutData.teleop.teleopCubes.total, teleSwitch + teleScale);
            addData(scoutData.teleop.tippedOver, $('#tipped').is(":checked"));
            addData(scoutData.teleop.died, $('#dead').is(":checked"));
            addData(scoutData.teleop.climbing.climbed, $('#climb').is(":checked"));
            addData(scoutData.teleop.climbing.gaveHelp, $('#gaveHelp').is(":checked"));
            addData(scoutData.teleop.climbing.recievedHelp, $('#recievedHelp').is(":checked"));
         
            console.log("ScoutData: " + scoutData);
        //    team.collection(event).doc(match).update(scoutData);
            userData.matchesScouted.push(scoutData.key);
            console.log("UserData: " + userData);
            console.log("UserRef: " + userRef);
            userRef.update(userData);
        })
        reset();
        displayMatches();
    });
    
});

/** Method gets the list of Event choices for the inputted team
* If the team is not in database, it initalizes the team with empty data for each match
*/
function getChoices(teamNum)
{
    team.get()
        .then(async snap => {
            $('#teamNum').removeClass("is-invalid");
            if (!snap.exists) {
                console.log("Team Currently Not in database");
                getEvents(teamNum)
                    .then(ret => {
                        sendToFirebase();
                        getChoices();
                    })
                    .catch(err => {
                        console.log(err)
                        $('#invalid').text(err);
                        $('#teamNum').addClass("is-invalid");
                    })
            }
            else {
                console.log("This exists");
                $('#match').parent().parent().parent().addClass("hidden");
                $('#form').addClass('hidden');
                $('#event').text("");
                $('#event').append("<option disabled selected value> -- select an option -- </option>");
                $('#match').text("");
                $('#match').append("<option disabled selected value> -- select an option -- </option>");
                console.log($("#event").parent().parent().parent().removeClass("hidden"));
                snap.data().collectionNames.forEach(function (event) {
                    $('#event').append("<option>" + event + "</option>");
                });
            }
        })
}

/**  
* Resets all form values
*/
function reset()
{
    $('#autoScale').val(0);
    $('#autoSwitch').val(0);
    $('#teleScale').val(0);
    $('#teleSwitch').val(0);
    $("#autoLine").prop("checked", false);
    $("#deadAuto").prop("checked", false);
    $("#tipped").prop("checked", false);
    $("#dead").prop("checked", false);
    $("#climb").prop("checked", false);
    $("#gaveHelp").prop("checked", false);
    $("#recievedHelp").prop("checked", false);
}

/** 
* Adds the data to the given location, or increases the frequency of the data if it 
* already exists
*/
function addData(location, data)
{
    value = location.value;
    frequency = location.frequency;
   if(value.includes(data))
        frequency[value.indexOf(data)] ++;
    else
    {
        console.log("pushing data");
        value.push(data);
        frequency.push(1);
    } 
}

/**
 * Displays the match options, only the matches the user hasn't scouted
 */
function displayMatches()
{
    $('#match').text("");
    $('#match').append("<option disabled selected value> -- select an option -- </option>");
    $('#match').parent().parent().parent().removeClass("hidden");
    $('#form').addClass('hidden');

    var collectionName = $('#event option:selected').text();
    console.log("the collection is: " + collectionName);

    team.collection(collectionName).get()
    .then(snap => {
        snap.docs.forEach(function(match){
            if(userData.matchesScouted.includes(match.data().key))
                return;
                console.log(match.id);
            $('#match').append("<option>" + match.id +"</option>");
        });
    })
}

/**
 * Handles the climbing checkbox behavior
 */
function climbedCheckboxes(button)
{
    var id = $(button).attr('id');
    console.log(id);
    if(id == "climb"){
        if($("#climb:checked").length == 0)
        {
            $("#gaveHelp").prop("checked", false);
            $("#recievedHelp").prop("checked", false);
        }
    }
    else {
        if ($('#gaveHelp:checked').length == 1 || $('#recievedHelp:checked').length == 1)
            $("#climb").prop("checked", true);
    }

}

