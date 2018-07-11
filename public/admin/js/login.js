$(function(){
    //表单校验
    //1 用户名不能为空,长度为3~6字段
    //2 密码不能为空,长度为6~12字段
    $("form").bootstrapValidator({
        //配置校验规则,指定根据表单的name校验字段
        fields:{
            //username的校验规则
            username:{
                //user的所有校验器
                validators:{
                    notEmpty:{
                        message:"用户名不能为空"
                    },
                    stringLength:{
                        min:3,
                        max:6,
                        message:"用户名长度必须是3-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }

                }
            },
            // password的校验规则
            password:{
                //user的所有校验器
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"用户密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码错误"
                    }

                }
            }
        },
        // 校验小图标的规则
        feedbackIcons:{
            valid:'glyphicon glyphicon-thumbs-up',
            invalid:'glyphicon glyphicon-thumbs-down',
            validating:'glyphicon glyphicon-refresh'
        }
    })
    // 注册表单校验完成事件,校验完成通过就发送ajax
    $("form").on("success.form.bv",function(e){
        // 阻止浏览器的默认行为
        e.preventDefault();
        // console.log( "哈哈哈" );
        // 发送ajax请求
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:$('form').serialize(),
            success:function(data){
                console.log( data );
                if(data.error === 1000){
                    // alert('用户名不存在');
                    $('form').data("bootstrapValidator").updateStatus("username",'INVALID','callback');
                }
                if(data.error === 1001){
                    // alert('密码错误');0
                    $('form').data("bootstrapValidator").updateStatus("password",'INVALID','callback');
                }
                if(data.success){
                    location.href="index.html";
                }
            }
        })
    })

    // 重置功能
    $('[type="reset"]').on("click",function(){
        $('form').data('bootstrapValidator').resetForm();
    })
})