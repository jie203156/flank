$(function () {
   $.ajax({
       url:"http://mmb.ittun.com/api/getbrandtitle",
       type:"get",
       dataType:"json",
       success:function (res) {
           console.log(res);
           var htmlstr=template('bran',res);
           $('.brandname').html(htmlstr)


       }
   });

    var backButton=$('.back_to_top');
    function backToTop() {
        $('html,body').animate({
            scrollTop: 0
        }, 4000);
    }
    backButton.on('click', backToTop);

});