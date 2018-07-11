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
    }, 1000)

})