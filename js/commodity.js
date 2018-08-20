$(function() {

    $.ajax({
        url: "http://mmb.ittun.com/api/getsitenav",
        typedata: "json",
        success: function(res) {
            var htmlstr = template("labelList", res);
            $(".main").html(htmlstr);
        }
    })
})