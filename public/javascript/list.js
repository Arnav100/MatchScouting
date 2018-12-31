document.addEventListener("DOMContentLoaded", async event => {
    console.log("List code running");
    
    $('#edit').on("click", editMode)
    $('#delete').on("click", deleteItem);
    $('#reset').on("click", resetList);

});

/**
 * Prompts the user to validate their delete decision
 */
function confirmDelete(item)
{
   
    var key = $(item).parent().parent().attr("data-key");
    var team = key.substr(0, key.indexOf(' '));

    $('#deleteModal .modal-body').html("<p id=\"deleteTeam\" data-key=\""+ key + "\">Are you sure you want to"
    + " delete Team " + team + " from your list? </p>");
}

/**
 * Deletes all teams from user list
 */
function resetList()
{
    userData.teamList = [];
    setUserData();
    makeTable();
}

/**
 * Deletes the team from user data
 */
function deleteItem()
{
    var team = $('#deleteTeam').attr("data-key");
    removeFromTeamList(team);
    setUserData();
    makeTable(); 
}

/**
 * Makes the table with all its features or says to sign in 
 */
function makeUserList()
{
    if (!currentUser)
        $(".card-body").text("You need to Sign In to see teams");
    else{
        makeTable(); 
        $("#sort").sortable();
        $("#sort").sortable("disable");
        $(".btn-delete").on("click", function(){
            confirmDelete(this);
        })
    }
}

/**
 * Makes the table based of teams in the user's list
 */
function makeTable()
{
    if (userData.teamList.length == 0)
        $(".card-body").html("Looks like you don't have any teams picked. "
            +"Go to the <a href = \"anaylze.html\"> anaylze page  </a> to pick teams");
    else
    {
        $("table").removeClass('disappear');
        $("#sort").text("");
        userData.teamList.forEach(team =>{
            var name = team.substr(0, team.indexOf(' '));
            var event = team.substr(team.indexOf(' ') + 1);
            $('#sort').append(getEmptyTableRow(team, name, event));
        });

    }
}

/**
 * Switches to team order edit mode
 */
function editMode()
{
    $('#edit').text("Save");
    $('#edit').removeClass('btn-info');
    $('#edit').addClass('btn-success');
    $('#edit').attr('id', 'save');
    $('#save').on("click", leaveEditMode);
    makeSortable()
}

/**
 * Makes the team list able to be sorted
 */
function makeSortable()
{
    $('tr button').each(function(){
        $(this).removeClass('fa-times');
        $(this).addClass('fa-bars');
        $(this).removeClass('bg-danger');
        $(this).addClass('bg-secondary');
        $(this).addClass('grab');
        $(this).removeAttr("data-toggle");
    });
   
    $('#sort').sortable("option", "handle", ".grab" );
    $("#sort").sortable("option", "cancel", "");
    $("#sort").sortable("enable");
}

/**
 * Stops the sortable feature for the list
 */
function stopSortable()
{
    $('tr button').each(function () {
        $(this).removeClass('fa-bars');
        $(this).addClass('fa-times');
        $(this).removeClass('bg-secondary');
        $(this).addClass('bg-danger');
        $(this).removeClass('grab');
        $(this).attr("data-toggle", "modal");
    });
    $("#sort").sortable("disable");
}

/**
 * Ends edit mode and saves the new order
 */
function leaveEditMode()
{
    $('#save').text("Change Order");
    $('#save').removeClass('btn-success');
    $('#save').addClass('btn-info');
    $('#save').attr('id', 'edit');
    $('#edit').on("click", editMode);
    stopSortable();
    saveOrder();
}

/**
 * Saves the new list order as the list
 */
function saveOrder() {
    var teams = $('#sort').children("tr");
    var keys = []
    for (var i = 0; i < teams.length; i++)
        keys.push($(teams[i]).attr("data-key"));
    userData.teamList = keys;
    setUserData();
}
