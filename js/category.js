$(function(){

    $.ajax({
        url:"http://mmb.ittun.com/api/getcategorytitle",
        dataType:"json",
        success:function(res){
            var html = template('getcategorytitle',res);
            $('.showList').html(html);


            $('.getcategory').each(function(index,ele){
                
                $.ajax({
                    url:"http://mmb.ittun.com/api/getcategory",
                    dataType:"json",
                    data:{titleid:$(ele).data("id")},
                    success:function(obj){  
                        // console.log(obj);
                        
                    var htmls = template('getcategory',obj);     
                    $(ele).html(htmls);
                    }
                })
            })


        }
    })

    $('.showList').on('click','.getgoodID',function(){
        var categoryId = $(this).data('id');
        sessionStorage.setItem('categoryId',categoryId);
    })

})