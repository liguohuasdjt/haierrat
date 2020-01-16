// window.onload = function(){
//     /*720代表设计师给的设计稿的宽度，你的设计稿是多少，就写多少;100代表换算比例，这里写100是
//       为了以后好算,比如，你测量的一个宽度是100px,就可以写为1rem,以及1px=0.01rem等等*/
//     getRem(720,100)
// };
// window.onresize = function(){
//     getRem(720,100)
// };
// function getRem(pwidth,prem){
//     var html = document.getElementsByTagName("html")[0];
//     var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
//     html.style.fontSize = oWidth/pwidth*prem + "px";
// }


;
(function() {
    if (!-[1, ]) {
        return 0;
    };
    var html = document.getElementsByTagName('html')[0];
    var script = document.getElementsByTagName('script')[0];
    //参数
    var psd_w = script.getAttribute('fu-psd');
    var _min = script.getAttribute('fu-min');
    var _max = script.getAttribute('fu-max');
    var full = script.getAttribute('fu-full');
    //常量
    var win = window;
    var doc = document;
    var dpr = window.devicePixelRatio || 1;
    var screen = win.screen;
    //手机宽高比 短:高
    var ratio = Math.min(screen.width, screen.height) / Math.max(screen.width, screen.height);
    //与FreeUi框架会师
    win.FreeUi = win.FreeUi || {};
    FreeUi['Rem'] = _rem;

    function _rem(psd_w, _min, _max, full) {
        var win = window;
        //设计稿宽
        var psd_w = Number(psd_w) || 640;
        //手机实际物理像素宽
        var win_w = html.getBoundingClientRect().width;
        //短的width
        if (!full) {
            var angle = window.screen.orientation ? window.screen.orientation.angle : 0;
            var orientation = win.orientation || angle || 0;
            if (orientation == 90 || orientation == -90) {
                //横屏
                win_w = win_w * ratio;
            };

        };
        var size = 100 / (psd_w / win_w);
        var _min = Number(_min) || 50;
        var _max = Number(_max) || 100;
        size = size >= _max ? _max : size;
        size = size <= _min ? _min : size;
        if (html.style.fontSize != size + 'px') {
            html.style.fontSize = size + 'px';
        };
        return size;
    };
    //立即执行
    var size = _rem(psd_w, _min, _max, full);
    //某些低性能安卓机延迟0.3s执行
    var _t = setTimeout(function() {
        _rem(psd_w, _min, _max, full);
    }, 300);

    //窗口改变
    var ua = navigator.userAgent;
    var is_orientation = Boolean('orientation' in win) && Boolean(ua.match(/iPhone|iPod|Android|ios|iPad|Windows Phone/));
    var event = is_orientation ? 'orientationchange' : 'resize';
    var time = is_orientation ? 300 : 100;
    if (!is_orientation || full) {
        win.addEventListener(event, function() {
            clearTimeout(_t);
            var _t = setTimeout(function() {
                _rem(psd_w, _min, _max, full);
            }, time);
        }, false);
    };
    //窗口显示
    win.addEventListener('pageshow', function() {
        clearTimeout(_t);
        var _t = setTimeout(function() {
            _rem(psd_w, _min, _max, full);
        }, time);
    }, false);

    win.addEventListener('pagehide', function() {
        clearTimeout(_t);
        var _t = setTimeout(function() {
            _rem(psd_w, _min, _max, full);
        }, time);
    }, false);
    //文档加载完成
    if ("complete" === doc.readyState) {
        _rem(psd_w, _min, _max, full);
    };
    doc.addEventListener("DOMContentLoaded", function() {
        _rem(psd_w, _min, _max, full);
    }, false);
})();