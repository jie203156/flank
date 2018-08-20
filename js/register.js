$(function() {
   // 1.获取用户名的值
 $("input[name=username]").blur(function() {
  // 用户名
  var username = $("input[name=username]").val().trim();
  if (username.length == 0) {
    $(".pusername").css({ opacity: 1 });
    return false;
  }
  if (username.length < 2) {
    $(".pusername").css({ opacity: 1 }).text("会员名" + username + "太短或太长，请输入2-14位");
    return false;
}  
});

   // 1.获取用户名的值
   $("input[name=username]").focus(function() {
    // 用户名
    var username = $("input[name=username]").val().trim();
    if (username.length == 0) {
      $(".pusername").css({ opacity: 0 });
      return false;
    }
    if (username.length < 2) {
      $(".pusername").css({ opacity: 0 }).text("会员名" + username + "太短或太长，请输入2-14位");
      return false;
  }
   });

// 2.获取密码
$("input[name=password]").blur(function() {
  // 密码
  var password = $("input[name=password]").val().trim();
  if (password.length == 0) {
    $(".password").css({ opacity: 1 });
    return false;
  }
 
});
// 2.获取密码
$("input[name=password]").focus(function() {
  // 密码
  var password = $("input[name=password]").val().trim();
  if (password.length == 0) {
    $(".password").css({ opacity: 0 });
    return false;
  }
 
});


// 3.获取邮箱
$("input[name=email]").blur(function() {
  var email = $("input[name=email]").val().trim();
  if (email.length == 0) {
    $(".email").css({ opacity: 1 });
    return false;
  }
});

// 3.获取邮箱
$("input[name=email]").focus(function() {
  var email = $("input[name=email]").val().trim();
  if (email.length == 0) {
    $(".email").css({ opacity: 0 });
    return false;
  }
});

// 4. 手机验证码校验
$("input[name=verification]").blur(function(){
  var verification = $("input[name=verification]").val().trim();
  if(verification.length == 0){
      $(".verification").css({ opacity: 1 });
      return false;
  }
});
// 4. 手机验证码校验
$("input[name=verification]").focus(function(){
  var verification = $("input[name=verification]").val().trim();
  if(verification.length == 0){
      $(".verification").css({ opacity: 0 });
      return false;
  }
});


  // 6.点击注册，跳转到登录界面
  $(".register").click(function() {


    window.location.href = "./login.html";
  });


   

      // 5.验证码的点击事件
      $(".btn-default").click(function() {
        // 空白框输入的验证码
        var textcode = $(".text").val();
        // 电话号码
        var tel = $("input[name=tel]").val();
    
        if (tel.length == 0) {
          alert("手机号码输入有误！");
          return;
        }
        if (textcode.length == "") {
          alert("请输入验证码");
          return;
        }
    
        // 判断手机不能为空以及验证码框也不能为空
        var count = 60;
        if (textcode.length != "" && tel.length != 0) {
          var timeId = setInterval(function() {
            count--;
            $(".btn-default")
              .addClass("disabled")
              .prop("disabled", true)
              .text("在" + count + "秒后重新发送");
    
            // 清空计时器
            if (count == 0) {
              clearInterval(timeId);
              $(".btn-default")
                .addClass("disabled")
                .prop("disabled", false)
                .text("重新发送验证码");
            }
          }, 1000);
        }
      });
    

});
