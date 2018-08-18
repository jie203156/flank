$(function () {
   $.ajax({
       url:"http://mmb.ittun.com/api/getbrandtitle",
       type:"get",
       dataType:"json",
       success:function (res) {
           console.log(res);
       }
   })

    var backButton=$('.back_to_top');
    function backToTop() {
        $('html,body').animate({
            scrollTop: 0
        }, 300);
    }
    backButton.on('click', backToTop);

});