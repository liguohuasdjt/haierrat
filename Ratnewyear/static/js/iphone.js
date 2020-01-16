$(".btninfo").click(btnCheck);
/**
 * [btnCheck 按钮倒计时常用于获取手机短信验证码]
 */
function btnCheck() {
    console.log(1)
    $(this).addClass("btninfoOn");
    var time = 59;
    //$(this).attr("disabled", true);
    var timer = setInterval(function() {
        if (time == 0) {
            clearInterval(timer);
            $(".btninfo").removeAttr("disabled");
            $(".btninfo").val("重新获取");
            $(".btninfo").removeClass("btninfoOn");
        } else {
            $('.btninfo').val(time + "s后重新获取");
            $(".btninfo").attr("disabled", true);
            time--;
        }
    }, 1000);
}