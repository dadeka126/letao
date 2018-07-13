$(function(){
    var page = 1;
    var pageSize = 3;
    // 1 页面一打开就动态渲染上一级分类的内容和分页模块
    render();
    // 2 点击添加分类,显示模态框
    $('.btn_add').on('click',function(){
        $('#addModal').modal('show');
    });
    // 3 校验模态框的表单
    $('form').bootstrapValidator({
        // 校验name字段
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"一级分类名称不能为空"
                    }
                }
            }
        },
        // 校验小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
          }
    })
    // 4 注册校验成功事件
    $('form').on('success.form.bv',function(e){
        //4.1 阻止默认行为
        e.preventDefault();
        console.log('哈哈哈');
        // 4.2 发送ajax请求
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$('form').serialize(),
            success:function(data){
                console.log(data);
                if(data.success){
                    // 4.3 模态框隐藏
                    $('#addModal').modal('hide');
                    // 4.4 重新渲染第一页
                    page = 1;
                    render();
                    // 4.5 表单重置
                    $('form').data('bootstrapValidator').resetForm(true);
                }
            }
        })

    })
    // 封装页面渲染
    function render(){
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(data){
                console.log( data );
                // 模版结合渲染
                $('tbody').html( template('tpl',data));
                // 分页功能
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage:page,
                    totalPages:Math.ceil(data.total/data.size),
                    onPageClicked:function(a,b,c,p){
                        page = p;
                        render();
                    }
                })
            }
        })
    }
});