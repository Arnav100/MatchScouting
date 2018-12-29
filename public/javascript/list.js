document.addEventListener("DOMContentLoaded", async event => {
    console.log("List code running")
    $('#edit').on("click", editMode)

    $('#load').on("click", function(){
        console.log("The current user is: " + currentUser);
        if (!currentUser)
            $(".card-body").text("You need to Sign In to see teams");
        else
            makeTable(); 
    });


    $("#sort").sortable();
    $("#sort").sortable("disable");
});

function makeTable()
{

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

function saveOrder()
{
    //This will save the new order as the order stored in firebase.
}