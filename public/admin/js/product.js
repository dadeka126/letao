$(function () {
    var page = 1;
    var pageSize = 3;
    var imgs = []; //用来存储上传的图片data
    render();

    // 1 封装渲染
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (data) {
                // console.log( data );
                // 模版渲染
                $('tbody').html(template('tpl', data));
                // 分页渲染
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, //指定bootstarp版本
                    currentPage: page,
                    totalPages: Math.ceil(data.total / data.size), //总页数
                    itemTexts: function (type, page, current) {
                        // console.log(type,page,current);
                        switch (type) {
                            case "first":
                                return '首页';
                            case "prev":
                                return "上一页";
                            case "page":
                                return page;
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                        }
                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return '首页';
                            case "prev":
                                return "上一页";
                            case "page":
                                return page;
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                        }
                    },
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render();
                    },
                    useBootstrapTooltip: true,


                })
            }
        })
    }

    // 2 点击添加商品事件
    $('.btn_add').on('click', function () {
        // 2.1 显示模态框
        $("#addModal").modal('show');
        // 2.2 发送ajax请求,获取二级分类数据,动态渲染
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                // console.log(data);
                $('.dropdown-menu').html(template('tpl2', data))
            }
        })
    });

    // 3 给ul的a注册点击事件(委托)
    $('.dropdown-menu').on('click', 'a', function () {
        // 3.1 获取到a的文本内容赋值给dropdown-text
        $('.dropdown-text').text($(this).text());
        // 3.2 获取到a的自定义属性data-id的id赋值给隐藏域input(brandId)
        $("[name='brandId']").val($(this).data('id'));
        // 3.3 -5 手动设置二级分类brandId校验通过
        $('form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
    });

    // 4 上传图片功能(插件fileupload)
    $('#fileuploald').fileupload({
        // done每次上传一张图片都会执行一次
        done: function (e, data) {
            // console.log(data.result);
            // 限制上传的图片不超过三张
            if (imgs.length === 3) return;
            imgs.push(data.result);
            // console.log(imgs);
            // 4.1 显示图片
            $('.img-box').append('<img src="' + data.result.picAddr + '" alt="" width="100" height="100">');
            // 4.2 -5 手动设置上传图片的校验通过; brandLogo是没有校验内容的,只是为了通过它来实现显示图片的校验
            if (imgs.length === 3) {
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
            } else {
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'INVALID');
            }

        }
    });

    // 5 表单校验
    $('form').bootstrapValidator({
        // 5.1 小图标校验
        // 配置图标校验
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
        },
        //   5.2 配置不做校验项
        excluded: [],
        // 5.3 字段校验
        fields: {
            proName: {
                validators: {
                    notEmpty: {
                        message: '商品名称不能为空'
                    }

                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '商品原价不能为空'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '商品价格不能为空'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '商品描述不能为空'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '商品尺寸不能为空'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '请输入正确的尺码格式(xx-xx)'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '商品库存不能为空'
                    },
                    // 正则校验
                    regexp: {
                        // 1-99999
                        regexp: /^[1-9]\d{0,4}$/,
                        message: '请输入正确的库存数量(1-9999)'
                    }
                }
            },
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    });

    // 6 注册表单校验通过完成事件
    $('form').on('success.form.bv', function (e) {
        e.preventDefault();
        // 6.1 发送ajax请求
        // 6.2 拼接需要传递的参数
        var parameter = $('form').serialize();
        console.log(parameter);
        parameter += '&picName1=' + imgs[0].picName + '&picAddr1=' + imgs[0].picAddr;
        parameter += '&picName2=' + imgs[1].picName + '&picAddr1=' + imgs[1].picAddr;
        parameter += '&picName3=' + imgs[2].picName + '&picAddr1=' + imgs[2].picAddr;
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: parameter,
            success: function (data) {
                // ajax请求成功:
                // 6.1.1 隐藏模态框
                // 6.1.2 重新渲染第一页
                // 6.1.3 重置表单
                // 6.1.4 手动重置选择二级分类和图片
                // 6.1.5 清空imgs数组
                console.log(data);
                if (data.success) {
                    $("#addModal").modal('hide');
                    page = 1;
                    render();
                    $('form').data('bootstrapValidator').resetForm(true);
                    $('.dropdown-text').text('请选择二级分类');
                    $('.img-box').empty();
                    imgs = [];
                }
            }
        })

    })
});