$(function () {
    var uid=sessionStorage.getItem("ress");
    sessionStorage.removeItem('ress');
    console.log(uid);
    var id=Number(uid);


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

    $.ajax({
        url:"http://mmb.ittun.com/api/getbrandproductlist",
        type:'get',
        data:{brandtitleid:id,pagesize:10},
        success:function (res) {
            console.log(res);
            htmlstr=template("panghang",res);
            $('.content2').html(htmlstr);

        }
    })
























});