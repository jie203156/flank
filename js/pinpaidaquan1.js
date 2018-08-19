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


   //  点击 品牌跳转
   $('.brandname').on('click',"li",function () {
      var id=$(this).data('id');
       sessionStorage.setItem('ress',id);
       window.location.href="pingpaidaquan2.html"

   });



    //  底部滚动到顶部动画
    var backButton=$('.back_to_top');
    function backToTop() {
        $('html,body').animate({
            scrollTop: 0
        }, 600);
    }
    backButton.on('click', backToTop);


//    下载链接跳转
    $('.header .img2').click(function () {
        window.location="http://android.myapp.com/myapp/detail.htm?apkName=com.manmanbuy.bijia&ADTAG=mobile";
    });


//    登录界面
    $('.login').click(function () {
        window.location.href=""
    })


//    注册界面接口
$('.register').click(function () {
    window.location.href=""
})



//    logo跳转主页的接口
    $('.header .img1').click(function () {
        window.location.href="";
    })

});