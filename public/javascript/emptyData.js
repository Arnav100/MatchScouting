/** 
 * This file is used so if any changes to the way data is stored are to be made, 
 * they only get changed here.
 */

/**
 * Returns an object with the fields used for storing match data
 */
function getEmptyMatchData(key)
{
    var data =
    {
        auto: {
            autoCubes: {
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
                }
            },
            autoLine: {
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
        },
        key: key
    }
    return data;
}

/**
 * Returns an object with the fields used for storing user data
 */
function getEmptyUserData()
{
    var data = 
    {
        matchesScouted: [],
        teamList: []
    }
    return data;
}