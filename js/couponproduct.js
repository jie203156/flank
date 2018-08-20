$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    $(".hidden").hide();

    //url的关键字提取函数
    function urlTool(urlStr) {
        //1. 把url以？分割
        var arr = urlStr.split("?").pop().split("&");
        console.log(arr); //["proName=1", "page=1"]
        var query = {};
        arr.forEach(function (v) {
            var param = v.split("=");
            query[param[0]] = param[1];
        });
        console.log(query);
        
        return query;    
    }

    var urlstr=window.location.href;
    var couponid=urlTool(urlstr);
    $.ajax({
        url: "http://mmb.ittun.com/api/getcouponproduct",
        type: "GET",
        data:couponid,
        success: function (res) {
            var htmlstr = template("product", { list: res.result });
            $(".products").html(htmlstr);
            for(var i=0;i<$("img").length;i++){
                $($("img")[i]).attr("name",i);
            }  
        }
    });

    var imgname;
    $(".products").on("click",".info",function(){
        var imgurl=$(this).find("img").attr("src");
        imgname=$(this).find("img").attr("name");
        $(".hidden").show();
        $(".hidden").find("img").attr("src",imgurl);
    })

    $(".hidden").click(function(){
        $(".hidden").hide();
    })

    $(".front").click(function(e){
        if(imgname>1){
            imgname--;
        }else{
            imgname=$("img").length-1;
        }
        // console.log( newname);
        // console.log($("img[name='"+newname+"']"));
        var newurl=$("img[name='"+imgname+"']").attr("src");
        $(".hidden").find("img").attr("src",newurl);
        e.stopPropagation()
    })

    $(".back").click(function(e){
        if(imgname<$("img").length-1){
            imgname++;
        }else{
            imgname=1;
        }
        // console.log( newname);
        // console.log($("img[name='"+newname+"']"));
        var newurl=$("img[name='"+imgname+"']").attr("src");
        $(".hidden").find("img").attr("src",newurl);
        e.stopPropagation()
    })



})