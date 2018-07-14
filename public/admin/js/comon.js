$(function () {
    // 发送ajax请求,显示进度条
    // 在ajax的ajaxStart事件和ajaxStop事件中显示进度条
    $(document).ajaxStart(function () {
        // console.log( "哈哈哈" );
        // 开启进度条
        NProgress.start();
    })
    $(document).ajaxStop(function () {
        // console.log( "哈哈哈" );
        // 停止进度条
        setTimeout(function () {
            NProgress.done();
        }, 500)

    });

    // 二级菜单隐藏与显示
    $(".second").prev().on("click", function () {
        $(this).next().slideToggle();
    });
    // 侧边栏显示与隐藏
    $(".lt_icon_l").on("click", function () {
        // console.log("哈哈哈");
        $(".lt_aside").toggleClass("move");
        $("body").toggleClass("move");
    })
    // 退出功能
    // 1 点击退出图标,显示模态框
    // 2 点击模态框中的退出按钮,发送ajax请求,退出到login页面
    $('.lt_icon_r').on('click', function () {
        $('#logoutModal').modal('show');
    })
    $('.btn-logout').on('click', function () {
        console.log('哈哈哈');
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            success: function (data) {
                // console.log(data);
                if (data.success) {
                    location.href = "login.html";
                }
            }
        })
    })

})