// $(function() {
//     $.ajax({
//         url: "http://mmb.ittun.com/api/getmoneyctrl",
//         // dataType: JSON,
//         data: { pageid: 1 },
//         success: function(res) {
//             // console.log(res);
//             var htmlstr = template("cartlist", res);
//             $(".cartlist").html(htmlstr);
//         }
//     })

// })


var mmm;
$(function() {
    mmm = new Mmm();
    mmm.ssk();

});
var Mmm = function() {

}


Mmm.prototype = {
    //获取省钱控
    ssk: function() {
        var zhi;
        $('.mui-numbox-input').on('change', function() {
            var zhi = $(this).val();
            console.log(zhi);

            $.ajax({
                url: "http://mmb.ittun.com/api/getmoneyctrl",
                data: {
                    pageid: zhi - 1
                },
                success: function(data) {
                    // console.log(data);
                    var result = template("cartlist", data);
                    $(".cartlist").html(result);
                }
            })

        })



        $.ajax({
            url: "http://mmb.ittun.com/api/getmoneyctrl",
            data: {
                pageid: 0
            },
            success: function(data) {
                // console.log(data);
                var result = template("cartlist", data);
                $(".cartlist").html(result);
            }
        })
    }
}