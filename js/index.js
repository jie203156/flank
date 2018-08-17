$(function(){

    $.ajax({
       url:"http://mmb.ittun.com/api/getindexmenu",
       dataType:"json",
       success:function(result){
           console.log(result);
           
            var html = template('getmenu',result);
            $('.getindexmenu').html(html);
            
       } 
    })


        


})