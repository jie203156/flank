$(function(){
    var category = sessionStorage.getItem('category');
    var productId = sessionStorage.getItem('productId');
    $.ajax({
        url:"http://mmb.ittun.com/api/getproduct",
        data:{
            productid:productId
        },
        dataType:"json",
        success:function(res){
            console.log(res);
            res.category =category;
            var html = template('getproduct',res);
            $('.breadcrumb').html(html);

            var htmls = template('getproductbj',res);
            $('.goodInfo').html(htmls);
        }
    })

    $.ajax({
        url:"http://mmb.ittun.com/api/getproductcom",
        data:{
            productid:productId,
        },
        dataType:"Json",
        success:function(res){
            console.log(res);
            var html = template('getproductcom',res);
            $('.comment').html(html);
        }
    })
})