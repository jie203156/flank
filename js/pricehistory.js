$(function(){
    // 1.input的焦点事件
    var inputval = $("input").val();
    // console.log(inputval);
    $("input").focus(function(){
        $(this).val("");
    });

    $("input").blur(function(){
        if(this.value == ""){
            this.value =inputval;
        }
    });

    // 2.查询点击事件
    // var queryhistory =  $(".query .searchhistory").text();
    $(".query .searchhistory").click(function(){
        setTimeout(function(){
            alert("我们还没有收录");
            $(".query .searchhistory").text("查询历史价格");
        },2000)
        $(this).text("查询中....");
        
        
        $(".llhide").show();
        $(".operate").hide();
    });

    // 4. 查询历史价格点击事件
    $(".footer span").click(function(){
        $(".footer").hide();
    });

    // 5.重置点击按钮事件
    $(".reset").click(function(){
        $(".searchhistory").text("查询历史价格");
        $(".llhide").hide();
        $(".operate").show();
    });



    // 5.照片点击跳转事件
    // $(".footer img").click(function(){
    //     location.href = "https://www.baidu.com/";
    // });
   


});
 // 3.点击返回键事件
function back(){
    $(".header a").click(function(){
        window.history.back();
    });

}