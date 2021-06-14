////////////////////////
/////MODAL ACTIONS/////
///////////////////////

$(".markAsFalseNegative").click(function (e) {
    $(".modal-markAsFalseNegativeConfirm").attr('id', $(e.delegateTarget).data("id"));
});


$(".modal-markAsFalseNegativeConfirm").click(function () {
    $.ajax({
        url: '/alerts/' + $(".modal-markAsFalseNegativeConfirm").attr('id') + "/mark",
        type: 'POST',
        data: jQuery.param({_csrf : $("#_csrf").attr("content")}),
        success: function(result) {
            document.location.reload();
        }
    });
});

$(".markAsResolved").click(function (e) {
    $(".modal-markAsResolved").attr('id', $(e.delegateTarget).data("id"));
});


$(".modal-markAsResolved").click(function () {
    $.ajax({
        url: '/alerts/' + $(".modal-markAsResolved").attr('id') + "/mark",
        type: 'POST',
        data: jQuery.param({_csrf : $("#_csrf").attr("content")}),
        success: function(result) {
            document.location.reload();
        }
    });
});