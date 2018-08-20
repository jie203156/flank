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
            if (zhi == 1) {
                $('body,html').animate({ scrollTop: 0 }, 500);
            }

            $.ajax({
                url: "http://mmb.ittun.com/api/getmoneyctrl",
                data: {
                    pageid: zhi
                },
                success: function(res) {
                    // console.log(data);
                    var htmlstr = template("productlist", res);
                    $(".products ul").html(htmlstr);
                }
            })

        })



        $.ajax({
            url: "http://mmb.ittun.com/api/getmoneyctrl",
            data: {
                pageid: 0
            },
            success: function(res) {
                // console.log(data);
                var htmlstr = template("productlist", res);
                $(".products ul").html(htmlstr);
            }
        })
    }
}