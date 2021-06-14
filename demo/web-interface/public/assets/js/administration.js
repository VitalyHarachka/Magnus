////////////////////////
/////MODAL ACTIONS/////
///////////////////////

$(".deleteUser").click(function (e) {
    $(".modal-deleteUserConfirm").attr('id', $(e.delegateTarget).data("id"));
});

$(".viewUser").click(function (e){
    window.location.href = $(e.delegateTarget).data("uri");
});

$(".modal-deleteUserConfirm").click(function () {
    $.ajax({
        url: '/users/' + $(".modal-deleteUserConfirm").attr('id'),
        type: 'DELETE',
        data: jQuery.param({_csrf : $("#_csrf").attr("content")}),
        success: function(result) {
            document.location.reload();
        }
    });
});

$("#userTab").click(function (e) {
    $("#createContent").fadeIn()
    $("#createContent").attr('data-target', "#modal-addUser");
    $("#createContent").attr('title', "Add a new user");
});

$("#studentsTab").click(function (e) {
    $("#createContent").fadeOut()
});

$("#campusTab").click(function (e) {
    $("#createContent").fadeIn()
    $("#createContent").attr('data-target', "#modal-addCampus");
    $("#createContent").attr('title', "Add a new campus/building");
});

$("#cameraTab").click(function (e) {
    $("#createContent").fadeOut()
});