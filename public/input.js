var events;
var matches = [];
var team;
var scoutData;
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    db = firebase.firestore();
    console.log("running");
    $('#teamNumButton').on("click",  function(){
        console.log("Fetching Data");
        var teamNum = $('#teamNum').val();
        team = db.collection("Teams").doc(teamNum);
        team.get()
        .then( snap => {
            if(!snap.exists)
            {
                console.log("Team Currently Not in database");
                console.log(snap.data());
                 getTeamData(teamNum)
                setTimeout(function () {

                 //   console.log("After: " + events);
                 //   console.log("After: " + matches);
                    
                    var eventNames = [];
                    for(var i = 0; i < events.length; i ++)
                    {
                   //     console.log("Event: "  + events[i].name);
               
             

                        eventNames.push(events[i].short_name);
                        for(var j = 0; j < matches[i].length; j ++)
                        {
                        //    console.log("Each Match: " + matches[i][j].match_number);
                            var matchNum = 'match' + matches[i][j];
                            var emptyData = 
                            {
                                auto: {
                                    autoCubes: {
                                        switch: {
                                            frequency:[],
                                            value:[],
                                        },
                                        scale: {
                                            frequency: [],
                                            value: [],
                                        },
                                        total: {
                                            frequency: [],
                                            value: [],
                                        }
                                    },
                                    autoLine:{
                                        frequency: [],
                                        value: [],
                                    },
                                    deadAuto: {
                                        frequency: [],
                                        value: [],
                                    },
                                },
                                teleop: {
                                    teleopCubes: 
                                    {
                                        switch: {
                                            frequency: [],
                                            value: [],
                                        },
                                        scale: {
                                            frequency: [],
                                            value: [],
                                        },
                                        total: {
                                            frequency: [],
                                            value: [],
                                        },
                                    },
                                    climbing: {
                                        climbed: {
                                            frequency: [],
                                            value: [],
                                        },
                                        gaveHelp: {
                                            frequency: [],
                                            value: [],
                                        },
                                        recievedHelp: {
                                            frequency: [],
                                            value: [],
                                        },
                                    },
                                    tippedOver: {
                                        frequency: [],
                                        value: [],
                                    },
                                    died: {
                                        frequency: [],
                                        value: [],
                                    },
                                }
                            }
                            team.collection(events[i].short_name).doc(matchNum).set(emptyData);
                            
                        }
                    }
                              var data = {};
                       data['collectionNames'] = eventNames;
                       team.set(data);
                }, 2000);

            }
            else 
            {
                console.log("This exists");
                console.log(snap.data());
                $('#event').text("");
                $('#event').append("<option disabled selected value> -- select an option -- </option>");
                $('#match').text("");
                $('#match').append("<option disabled selected value> -- select an option -- </option>");

                snap.data().collectionNames.forEach(function(event){
                    console.log(event);
                    $('#event').append("<option>"+event+"</option>");
                });
            }
        })
    });
    $('#event').change(function () {
        $('#match').text("");
        $('#match').append("<option disabled selected value> -- select an option -- </option>");

        displayMatches();
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

    $("#submit").on("click", function(){
        var event = $('#event option:selected').text();
        var match = $('#match option:selected').text()

        team.collection(event).doc(match).get()
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
          //  addData(scoutdata.auto.deadAuto, )
            console.log(scoutData);
          team.collection(event).doc(match).update(scoutData);
        })
    });
  

  
});

function addData(location, data)
{
   // console.log("Data is" + data);
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

function displayMatches()
{
    var collectionName = $('#event option:selected').text();
    console.log("the collection is: " + collectionName);

    team.collection(collectionName).get()
    .then(snap => {
        snap.docs.forEach(function(match){
            $('#match').append("<option>" + match.id +"</option>");
        });
    })
}

async function getTeamData(teamNum)
{
   await getEvents(teamNum);
   return;
}

async function getEvents(teamNum)
{
    
    var url = 'https://www.thebluealliance.com/api/v3/team/frc' + teamNum + '/events/2018';
  await $.ajax({
        url: url,
        headers: {
            'X-TBA-Auth-Key': 'zTWiMdEibkf1pFn7GpzX3jlhaTzVXKmT2QFOxkQVyQWeqtiZ58YKkodGbeKoeIRV'
        },
        method: 'GET',
        dataType: 'json',
        success: async function (data) {
           
            if (data == "")
                console.log("Team Is Not Competing in 2019");
                events = []
                for(var i = 0; i < data.length; i ++)
                    if(data[i].short_name != "")
                        events.push(data[i]);


            // for(var i = 0; i < events.length; i ++)
            // {
            //     matches.push(getMatches(teamNum, events[i]));
            // }
          await  events.forEach(async function (event) {
              //  console.log("Event: " + event.short_name);
               await getMatches(teamNum, event)
                .then(result => {
                    console.log("Complete");
                })
            });
        }
    });
    return;
}

async function getMatches(teamNum, event)
{
    key = event.key;
    var url = 'https://www.thebluealliance.com/api/v3/team/frc' + teamNum + '/event/' + key + '/matches';
    await $.ajax({
        url: url,
        headers: {
            'X-TBA-Auth-Key': 'zTWiMdEibkf1pFn7GpzX3jlhaTzVXKmT2QFOxkQVyQWeqtiZ58YKkodGbeKoeIRV'
        },
        method: 'GET',
        dataType: 'json',
        success: async function (data) {
            
            if (data == "")
                console.log("Team Is Not Competing in 2019");
          
            var eventMatches = [];
           await data.forEach(function(match){
                if(match.comp_level == "qm"){
            //    console.log("Event: " + event.short_name + " Match: " +  match.match_number
            //    + " Comp Level: " +match.comp_level);
                var num = "" + match.match_number;
                for(var i = num.length; i < 3; i++)
                {
                    num = "0" + num;
                }
                eventMatches.push(num);
                }
            });
            eventMatches.sort();
          await  matches.push(eventMatches);
        }
    });
}

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