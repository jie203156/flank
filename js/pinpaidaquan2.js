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
























});