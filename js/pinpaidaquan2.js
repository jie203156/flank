$(function () {
    rander2(0);
    rander1(0);
    rander(3);


    var uid=sessionStorage.getItem("ress");
    sessionStorage.removeItem('ress');
    console.log(uid);
    var id=Number(uid);
    rander2(id);
    rander1(id);


    $('.content2').on('click','.pinpaiming',function () {
        var ids=$(this).data('id');
        var id=Number(ids);
       rander(id);

    });

    function rander(id) {
        $.ajax({
            url:"http://mmb.ittun.com/api/getproductcom",
            type:"get",
            data:{productid:id},
            success:function (res) {
                console.log(res);
                var htmlstr=template("pingl",res)
                $('.userconmet').html(htmlstr);
            }
        })
    }

    function rander1(id) {
        $.ajax({
            url:"http://mmb.ittun.com/api/getbrandproductlist",
            type:'get',
            data:{brandtitleid:id,pagesize:10},
            success:function (res) {
                console.log(res);
                htmlstr=template("panghang",res);
                $('.content2').html(htmlstr);

            }
        });
    }

    function rander2(id) {
        $.ajax({
            url:"http://mmb.ittun.com/api/getbrand",
            type:"get",
            dataType:"json",
            data:{brandtitleid:id},
            success:function (res) {
                console.log(res);
                var htmlstr=template('mmp',res)
                $('.zhanshi').html(htmlstr);

            }
        });

    }


//    跳转商品详情页
    $('.content1').on('click','#dianshi',function () {
           var productId=$(this).data('id');
           sessionStorage.setItem('ids',productId);
           window.location.href=""


    })


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
        window.location.href="login.html"
    })


//    注册界面接口
    $('.register').click(function () {
        window.location.href="register.html"
    })



//    logo跳转主页的接口
    $('.header .img1').click(function () {
        window.location.href="index.html";
    })
























});