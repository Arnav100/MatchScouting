document.addEventListener("DOMContentLoaded", async event => {
    console.log("List code running");
    
    $('#edit').on("click", editMode)
    $('#delete').on("click", function(){
        deleteItem()
    });
    $('#reset').on("click", resetList);

});

function confirmDelete(item)
{
   
    var key = $(item).parent().parent().attr("data-key");
    var team = key.substr(0, key.indexOf(' '));

    $('#deleteModal .modal-body').html("<p id=\"deleteTeam\" data-key=\""+ key + "\">Are you sure you want to"
    + " delete Team " + team + " from your list? </p>");
}

function resetList()
{
    userData.teamList = [];
    setUserData();
    makeTable();
}

function deleteItem()
{
    var team = $('#deleteTeam').attr("data-key");
    removeFromTeamList(team);
    setUserData();
    makeTable(); 
}

function makeUserList()
{
    console.log("The current user is: " + currentUser);
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

function makeTable()
{
    console.log("user data is: " + userData);
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

function editMode()
{
    $('#edit').text("Save");
    $('#edit').removeClass('btn-info');
    $('#edit').addClass('btn-success');
    $('#edit').attr('id', 'save');
    $('#save').on("click", leaveEditMode);
    makeSortable()
}

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

function saveOrder() {
    var teams = $('#sort').children("tr");
    var keys = []
    for (var i = 0; i < teams.length; i++)
        keys.push($(teams[i]).attr("data-key"));
    userData.teamList = keys;
    setUserData();
}
