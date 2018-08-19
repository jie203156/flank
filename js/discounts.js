$(function(){
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    $.ajax({
        url:"http://mmb.ittun.com/api/getcoupon",
        type:"GET",
        success:function(res){
            var htmlstr=template("coupon",{list:res.result});
            console.log(htmlstr);
            
            $(".coupon").html(htmlstr);
        }
    });

    $(".coupon").on("click","div",function(){
        window.location.href="./couponproduct.html?couponid="+$(this).data("id");
    })
       
    

})