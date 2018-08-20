$(function () {

    // 头部后退按钮回到首页
    $('.back .fa').on('click', function () {

        window.location.href = "./index.html"
    })

    var shopid;
    var areaid;

    
    function render(shopid, areaid) {

        $.ajax({

            url: "http://mmb.ittun.com/api/getgsproduct",
            data: {
                shopid: shopid,
                areaid: areaid
            },
            success: function (obj) {

                var productshtml = template('productlist', obj)
                $('.products').html(productshtml);
            }
        })
    }

    // 默认加载
    render(0, 0)


    // 点击事件加载模板
    // 用来获取凑单品的店铺的信息 并渲染到店铺的下拉列表
    $('.shop').on('click', function () {

        // 点击后,先让列表隐藏
        $('.list').hide();
        $('.filter').hide();
        $('.filter').removeClass('state')
        // 然后除这个被点击外的其他盒子都应该修改为朝上
        $(this).siblings().children('.fa').removeClass('fa-caret-down').addClass('fa-caret-up');



        $.ajax({

            url: "http://mmb.ittun.com/api/getgsshop",
            success: function (obj) {

                // 修改箭头
                if ($('.shop i').hasClass('fa-caret-up')) {
                    $('.shop i').removeClass('fa-caret-up').addClass('fa-caret-down');
                    $('.list').stop().fadeIn();
                } else {
                    $('.shop i').removeClass('fa-caret-down').addClass('fa-caret-up');
                    $('.list').stop().fadeOut();
                }

                var shoplist = template('shoplist', obj)
                $('.list').html(shoplist);
            }
        })

    })



    $('.place').on('click', function () {

        // 点击后,先让列表隐藏
        $('.list').hide();
        $('.filter').hide();
        $('.filter').removeClass('state')
        // 然后除这个被点击外的其他盒子都应该修改为朝上
        $(this).siblings().children('.fa').removeClass('fa-caret-down').addClass('fa-caret-up');

        // 修改箭头


        $.ajax({

            url: "http://mmb.ittun.com/api/getgsshoparea",
            success: function (obj) {

                if ($('.place i').hasClass('fa-caret-up')) {
                    $('.place i').removeClass('fa-caret-up').addClass('fa-caret-down');
                    $('.list').stop().fadeIn();
                } else {
                    $('.place i').removeClass('fa-caret-down').addClass('fa-caret-up');
                    $('.list').stop().fadeOut();
                }
                var placelist = template('placelist', obj)
                $('.list').html(placelist);
            }
        })


    })


    $('.price').on('click', function () {

        // 点击后,先让列表隐藏
        $('.list').hide();
        $('.filter').hide();
        $('.filter').removeClass('state')

        // 然后除这个被点击外的其他盒子都应该修改为朝上
        $(this).siblings().children('.fa').removeClass('fa-caret-down').addClass('fa-caret-up');

        // 修改箭头
        if ($('.price i').hasClass('fa-caret-up')) {
            $('.price i').removeClass('fa-caret-up').addClass('fa-caret-down');
            $('.list').stop().fadeIn();
        } else {
            $('.price i').removeClass('fa-caret-down').addClass('fa-caret-up');
            $('.list').stop().fadeOut();
        }

        var pricelist = template('pricelist');
        $('.list').html(pricelist);
    })


    $('.list').on('click', "li", function () {

        $(this).children('i').addClass('fa-check');
        $(this).siblings('li').children('i').removeClass('fa-check')

        var content = $(this).children('.text').text();
        if (content.length >= 7) {

            content = content.slice(-content.length, 2)
        }


        shopid = $(this).data('shopid');
        areaid = $(this).data('areaid');

        render(shopid?shopid:0,areaid?areaid:0);


        $('.nav>.left i').removeClass('fa-caret-down').addClass('fa-caret-up');
        $('.list').stop().hide();

        
        // 这里做个判断 如果有data**属性  就修改对应的值
        if ( $(this).data('shopid')) {

            $('.shop .text').html(content)
        } else if ( $(this).data('areaid')) {

            $('.place .text').html(content);
        } else if ( $(this).data('priceid')){

            $('.price .text').html(content);
        }

    })


    // 筛选菜单
    $('.nav>.right').on('click', function () {

        // $('.filter')
        // 默认是隐藏的
        // 点击后判断,如果是隐藏的,就给他添加类名并且显示

        if ($('.filter').hasClass('state')) {

            $('.filter').removeClass('state')
            $('.filter').hide();
            $('.nav>.right i').removeClass('fa-times').addClass('fa-th-list')
        } else {

            $('.filter').show();
            $('.filter').addClass('state')
            $('.nav>.right i').removeClass('fa-th-list').addClass('fa-times')
        }

        // 改变其他几个按钮的状态
        $('.nav>.left i').removeClass('fa-caret-down').addClass('fa-caret-up');
        $('.list').stop().hide();

    })


    // 菜单栏active
    $('.filter button').on('click', function () {

        $(this).addClass('active').siblings('button').removeClass('active')
        $('.nav>.right i').removeClass('fa-times').addClass('fa-th-list');
        $('.filter').hide();
        $('.filter').removeClass('state')
    })


    // 搜索栏事件
    $('.filter .searchbar .right').on('click',function(){

        var text = $(this).siblings('.left').children('input').val().trim();
        
        if ( text == "" ) {

            alert("写值啊,食屎啊你")
        }
        console.log(text);
        $(this).siblings('.left').children('input').val("")

        alert('别点了,爸爸没写这个功能')
        render(0,0)

        $('.filter').removeClass('state')
        $('.filter').hide();
        $('.nav>.right i').removeClass('fa-times').addClass('fa-th-list')

        
    })


})