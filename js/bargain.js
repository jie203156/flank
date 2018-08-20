$(function(){
    //获取导航栏事件
    function title(){
        $.ajax({
            url:"http://mmb.ittun.com/api/getbaicaijiatitle",
            type:"get",
            datatype:"Json",
            success:function(res){  
                res.result.length = 6;
                
                var html = template("navlist",res);
                $(".nav ul").html(html);

                
            }
        })
    }

    title();
    products(0);
    
    // title的点击事件
    $(".nav").on("click","li",function(){
        $(this).addClass("active").siblings().removeClass("active");
        var tid = $(this).data("id");
        
        
        
        products(tid);
    })
    

    // 获取商品详情
    function products(tid){
        $.ajax({
            url:"http://mmb.ittun.com/api/getbaicaijiaproduct",
            type:"get",
            data:{titleid:tid},
            datatype:"Json",
            success:function(res){
                console.log(res);
                console.log(res.result[0].productImg);
                

                
                var html = template("productslist",res);
                $(".products").html(html);
                 
            }
        })
    }


    //返回顶部点击事件
    $(".btn, .back").click(function(){
        
        window.scrollTo(0,0);
    })


})