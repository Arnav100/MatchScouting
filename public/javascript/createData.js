function sendToFirebase()
{
    console.log("This happens last");
    var eventNames = [];
    var eventKeys = []
    for (var i = 0; i < events.length; i++) {
        eventNames.push(events[i].short_name);
        eventKeys.push(events[i].key);
        for (var j = 0; j < matches[i].length; j++) {

            var matchNum = 'match' + matches[i][j];
            var emptyData = getEmptyMatchData(keys[i] + matches[i][j]);
            
            team.collection(events[i].short_name).doc(matchNum).set(emptyData);
        }
    }
    var data = {};
    data['collectionNames'] = eventNames;
    data['keys'] = eventKeys;
    team.set(data);
}

/**
 * Used for creating teams in database, gets the events the team is participating in
 */
async function getEvents(teamNum) {

    var url = 'https://www.thebluealliance.com/api/v3/team/frc' + teamNum + '/events/2018';
    await $.ajax({
        url: url,
        headers: {
            'X-TBA-Auth-Key': 'zTWiMdEibkf1pFn7GpzX3jlhaTzVXKmT2QFOxkQVyQWeqtiZ58YKkodGbeKoeIRV'
        },
        method: 'GET',
        dataType: 'json',

    })
        .then(async data => {
            if (data == "")
                throw "Team Is Not Competing in 2019";

            events = [];
            for (var i = 0; i < data.length; i++)
                if (data[i].short_name != "")
                    events.push(data[i]);
            console.log("Before making matches");
            for (const event of events) {
                await getMatches(teamNum, event)
                    .then(result => {
                        console.log("Complete");
                    })
            }

            console.log("After making matches");
        })
        .catch(err => {
            if (typeof err != "string")
                err = "Team Does Not Exist";
            throw err;
        })
    return 0;
}

/**
 * Used for creating teams in database, gets the matches the team is participating in the event
 */
async function getMatches(teamNum, event) {
    key = event.key;
    keys.push(key);
    var url = 'https://www.thebluealliance.com/api/v3/team/frc' + teamNum + '/event/' + key + '/matches';
    await $.ajax({
        url: url,
        headers: {
            'X-TBA-Auth-Key': 'zTWiMdEibkf1pFn7GpzX3jlhaTzVXKmT2QFOxkQVyQWeqtiZ58YKkodGbeKoeIRV'
        },
        method: 'GET',
        dataType: 'json',
        success: async function (data) {

            if (data == "") {
                console.log("Team was Not Competing in 2018");
                return;
            }

            var eventMatches = [];
            console.log("This happens before each event match")
            for (const match of data) {
                if (match.comp_level == "qm") 
                {
                    var num = "" + match.match_number;
                    for (var i = num.length; i < 3; i++) {
                        num = "0" + num;
                    }
                    eventMatches.push(num);
                }
            }
            eventMatches.sort();
            await matches.push(eventMatches);
            console.log("This happens after each event match")
        }
    });
}
