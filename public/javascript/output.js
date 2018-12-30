var team;
var matchNames;
var autoScale;
var autoSwitch;
var autoChart;

var teleScale;
var teleSwitch;
var teleChart;

var autoLineCount;
var deadAutoCount;

var climbed;
var gotHelp;
var gaveHelp;
var died;
var tippedOver;

var climbChart;

document.addEventListener("DOMContentLoaded", event => {
    reset();

    console.log("running");
    $('#teamNumButton').on("click", function() {
        if(getTeam())
            displayEvents();
        else 
            $('#event').addClass('hidden');
        
    });
    $('#event').change(function () {
        reset();
        displayData();
    });
    $('#list').on("click", function(){
        toggleTeam();
    })
});

function toggleTeam()
{
    var pickedTeam = $('#teamNum').val() + " " + $('#event option:selected').text();
    if($('#list').hasClass('btn-success'))
    {
        userData.teamList.push(pickedTeam)
        changeToRemove();
    }
    else
    {
        removeFromTeamList(pickedTeam);
        changeToAdd();
    } 
    setUserData();
}

function changeToRemove()
{
    $('#list').removeClass('btn-success');
    $('#list').addClass('btn-danger');
    $('#list').text("Remove From List");

}

function changeToAdd()
{
    $('#list').removeClass('btn-danger');
    $('#list').addClass('btn-success');
    $('#list').text("Add To List");
}

function reset()
{
    matchNames = [];
    autoScale = [];
    autoSwitch = [];
    teleScale = [];
    teleSwitch = [];
    autoLineCount = [0];
    deadAutoCount = [0];
    climbed = [0];
    gotHelp = [0];
    gaveHelp = [0];
    died = [0];
    tippedOver = [0];
}

async function displayData(event)
{
    $('#display').removeClass('hidden');
    var currentTeam = $('#teamNum').val() + " " + $('#event option:selected').text();
    if (userData.teamList.includes(currentTeam))
        changeToRemove();
    else
        changeToAdd();
    
    $('#list').removeClass('hidden');
   
   var collectionName = $('#event option:selected').text();
   console.log("Collection:" + collectionName);
   await team.collection(collectionName).get()
   .then(matches =>{
      console.log("Matches: " + matches)
        for(const match of matches.docs)
        {
            var data = match.data();
            pullArrayData(data.auto.autoCubes.scale, autoScale);
            matchNames.push(match.id);
            pullArrayData(data.auto.autoCubes.switch, autoSwitch);
            pullArrayData(data.teleop.teleopCubes.switch, teleSwitch);
            pullArrayData(data.teleop.teleopCubes.scale, teleScale);
            pullBooleanData(data.auto.autoLine, autoLineCount);
            pullBooleanData(data.auto.deadAuto, deadAutoCount);
            pullBooleanData(data.teleop.tippedOver, tippedOver);
            pullBooleanData(data.teleop.died, died);
            pullBooleanData(data.teleop.climbing.climbed, climbed);
            pullBooleanData(data.teleop.climbing.gaveHelp, gaveHelp);
            pullBooleanData(data.teleop.climbing.recievedHelp, gotHelp); 
        }

   });

   autoChart = makeChart("Auto", autoChart, autoScale, autoSwitch);
   teleChart = makeChart("Teleop", teleChart,teleScale, teleSwitch);
   makeClimbChart(climbed[0], gaveHelp[0], gotHelp[0]);

   makeCard("deadAuto", deadAutoCount );
   makeCard("lineCross", autoLineCount);
   makeCard("dead", died);
   makeCard("tipped", tippedOver);
   makeCard("climbTotal", climbed);

} 

function pullBooleanData(location, counter)
{
    var i = indexOfMax(location.frequency);
    if(i == -1)
        return i;
    if(location.value[i])
        counter[0] ++ ;
}

function pullArrayData(location, array)
{
    var i = indexOfMax(location.frequency)
    if(i == -1)
        return i;
    array.push(location.value[i]);
}

async function displayEvents()
{
    $('#display').addClass('hidden');
    $('#list').addClass('hidden');
 await   team.get()
        .then(async function (snap) {
            if(!snap.exists)
            {
                $('#teamNum').addClass("is-invalid");
                $('#invalid').text("Team Not in database");
                $('#event').parent().parent().parent().parent().addClass('hidden');
            }
            else{
                $('#event').parent().parent().parent().parent().removeClass('hidden');
                $('#event').text("");
                $('#event').append("<option disabled selected value> -- select an option -- </option>");
                for(var i = 0; i < snap.data().collectionNames.length; i ++)
                    $('#event').append("<option>" + snap.data().collectionNames[i] + "</option > ");
            }     
        });
}

function makeCard(id, data)
{
    $("#" + id).text(data[0]);
}

function makeChart(type, chart, scale, swich)
{
    var maxTicks = 10;
    if(type == "Teleop")
        maxTicks = 10;

    var data = {
        labels: matchNames,
        datasets: [
        {
            label: type + " Scale",
            backgroundColor: "orange",
            data: scale,
        },
            {
                label: type + " Switch",
                backgroundColor: "gold",
                data: swich,
            }]
    };
    var options = {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        scales:
        {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: maxTicks
                }
            }]
        }
    };

    if(chart == null)
    {
        chart = new Chart($('#' + type + 'Chart'),{
            type: 'bar',
            data: data,
            options: options
        });
    }
    else
    {
        chart.data = data;
        chart.update()
    }
    return chart;
}

function makeClimbChart(total, gave, got)
{
    var data = {
        datasets: [
            {
                data: [got,gave, (total - (got+ gave))],
                backgroundColor: ["blue", "green", "purple"]
            }],
        labels: ["Got Help", "Gave Help", "Normal"]
        
    };
    var options = {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        scales:
        {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    if (climbChart == null)
        climbChart = new Chart($('#ClimbChart'), {
            type: 'doughnut',
            data: data,
            options: options
        });
    else
    {
        climbChart.data = data;
        climbChart.update();
    }
    
}

function getTeam()
{   
    console.log("getting team");
    $('#teamNum').removeClass("is-invalid");
    var teamNum = $('#teamNum').val();
    if (!currentUser) {
        $('#teamNum').addClass("is-invalid");
        $('#invalid').text("Need to sign in to see data");
        return false; 
    }
    team = db.collection("Teams").doc(teamNum);

    console.log(team.id);   
    return true;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}