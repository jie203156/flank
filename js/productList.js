
$(function(){

    var getcategoryId = sessionStorage.getItem('categoryId');

    //获得面包屑导航
    $.ajax({
        url:"http://mmb.ittun.com/api/getcategorybyid",
        data:{
            categoryid:getcategoryId
        },
        dataType:"json",
        success:function(res){
            console.log(res);
            window.sessionStorage.setItem('category',res.result[0].category);
       
            var html = template('getcategory',res.result[0]);
            $('.breadcrumb').html(html);
        }
    })

    var page = 1;
    rendergoods(page);
    
    $.ajax({
        url:"http://mmb.ittun.com/api/getproductlist",
        data:{
            categoryid:getcategoryId,
            pageid:1,
        },
        dataType:"json",
        success:function(res){
            var totalpage = Math.ceil(res.totalCount/res.pagesize);
            totalpages = totalpage;

            getpage (totalpage)
        }
    })

    function getpage (totalpage){
        // 分页获取
        $('.pagination').jqPagination({
            max_page:totalpage,
            page_string:'{current_page} / {max_page}',
    
            paged: function(page) {
                
                    rendergoods(page);
                    // getDataByPage(page);
            }
        })
    }


    // 获取商品的封装函数
    function rendergoods(page){
        $.ajax({
            url:"http://mmb.ittun.com/api/getproductlist",
            data:{
                categoryid:getcategoryId,
                pageid:page,
            },
            dataType:"json",
            success:function(res){
                // totalCount = res.totalCount;
                console.log(res);

                var html = template('getproductlist',res);
                $('.goodLists').html(html)

                var totalpage = Math.ceil(res.totalCount/res.pagesize);
                totalpages = totalpage;
            }
        })
    }



    


    $('.goodLists').on('click','a',function(){
        var productId = $(this).data('id');
        window.sessionStorage.setItem('productId',productId);
    })


    
// _______________________________________________

    jQuery(document).ready(function( $ ) {
        $("#menu").mmenu({
            "slidingSubmenus": false,
            "extensions": [
                "pagedim-black"
                
            ],
            "navbar":
            {
            "add": true,
            "title": "筛 选"
            }
        });
    });

    $('#panel-menu>li a ul>li').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    })
})