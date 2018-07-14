$(function () {
    var page = 1;
    var pageSize = 5;
    // 1 页面加载完就动态渲染上二级表格内容和分页模块
    render();
    // 2 点击添加按钮,显示模态框,
    $('.btn_add').on('click', function () {
        // 2.1 显示模态框
        $('#addModal').modal('show');
        // 2.2 发送ajax请求,渲染一级分类
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                console.log(data);
                $('.dropdown-menu').html(template("tpl1", data))
            }
        })
    });
    // 3 给每个a注册点击事件,获取到文本,在按钮的text上显示
    $('.dropdown-menu').on('click', 'a', function () {
        // console.log('哈哈哈');
        // 3.1 获取到文本
        $('.dropdown-text').text($(this).text());
        // 3.2 获取到id,赋值给隐藏域,传递给后台
        var id = $(this).data('id');
        $("[name='categoryId']").val(id);
        // 3.3 -5 手动校验a里id隐藏域的状态通过
        $('form').data('bootstrapValidator').updateStatus('categoryId','VALID');
    });
    // 4 上传图片功能
    $('#fileuploald').fileupload({
        done:function(e,data){
            console.log(data.result);
            // 4.1 显示图片
            $('.img-box img').attr('src',data.result.picAddr);
            // 4.2 发送图片地址,赋值给隐藏域,传递给后台
            $("[name='brandLogo']").val(data.result.picAddr);
            // 4.3 -5 手动校验图片通过
            $('form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
    // 5 表单校验功能
    $('form').bootstrapValidator({
        // 字段校验
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择一级分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'二级分类不能为空'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传一张品牌的图片'
                    }
                }
            }

        },
        // 配置不做校验的类型
        excluded: [],
        // 配置图标校验
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
          }

    });
    // 6 注册表单校验成功事件
    $('form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('form').serialize(),
            success:function(data){
                console.log(data);
                if(data.success){
                    // 6.1 隐藏模态框
                    $('#addModal').modal('hide');
                    // 6.2 重新渲染第一页
                    page = 1;
                    render();
                    // 6.3 表单重置
                    $('form').data('bootstrapValidator').resetForm(true);
                    // 6.4 其他的需要手动重置
                    $(".dropdown-text").text('请选择一级分类');
                    $('.img-box img').attr('src','./images/none.png');
                }
            }
        })
    })


    // 封装渲染
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log(data);
                // 模版结合渲染
                $('tbody').html(template('tpl', data));
                // 分页模块
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(data.total / data.size),
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render();
                    }
                })
            }
        })
    }
});