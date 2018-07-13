$(function () {
    var page = 1; //当前页
    var pageSize = 5; //每页的条数
    // 1 页面一加载完就动态渲染;分成分页
    render();
    // 2 点击禁用和启用的功能
    var id;
    var isDelete;
    $('tbody').on('click', '.btn', function () {
        // 2.1 显示模态框
        $('#userModal').modal('show');
        // 2.2 点击启用/禁用按钮获取到对应的id和isdelete
        id = $(this).parent().data('id');
        console.log(id);
        isDelete = $(this).hasClass('btn-success') ? '1' : '0';
        console.log(isDelete);
    });
    // 3 点击确定按钮功能
    $('.btn-comfirm').on('click',function(){
        // 3.1 发送ajax请求
        $.ajax({
            type:'post',
            url:'/user/updateUser',
            data:{
                id:id,
                isDelete:isDelete
            },
            success:function(data){
                console.log(data);
                if(data.success){
                    // 3.2 隐藏模态框
                    $('#userModal').modal('hide');
                    // 3.3 重新渲染页面
                    render();
                }
            }
        })
    })



    // 封装渲染页面
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log( data );
                $("tbody").html(template("tpl", data));
                // 2 实现分页功能
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, //指定bootstarp版本
                    currentPage: page, //设置当前页
                    totalPages: Math.ceil(data.total / data.size), //总页数
                    size: 'small',
                    onPageClicked: function (a, b, c, p) {
                        page = p; //修改当前页
                        render(); //重新渲染页面
                    }
                })
            }
        })
    }
});