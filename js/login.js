$(function(){
// 1. 登录事件
    $(".btn").click(function(){
    var password = $(".password").val();
    var username = $(".main .username").val();
    var user = password+username;

    if(!(/^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$$/.test(username))){
    alert("请输入正确的手机号");
    return;
    }
    if(!(/^[\w]{6,12}$/.test(password))){
    alert("密码格式为6-12位，只能是字母，数字或者下划线");
    return;
    }

    if($("input[type=checkbox]").is(":checked")){
    localStorage.setItem("user",user);
    // alert("后面一个月免登陆哦，亲！")
    }
    location.href = "./index.html";
    });

    $(".app-bar>.left>.glyphicon").click(function(){
        $(".app-bar").hide();
    })
});

