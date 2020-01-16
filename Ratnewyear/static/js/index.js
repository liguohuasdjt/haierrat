var myScroll;

/**
 * 初始化iScroll控件
 */
function loaded() {

    // myScroll = new iScroll('wrapper', {
    //     scrollY: true,
    //     scrollbars: true,
    //     useTransition: false,
    //     hideScrollbar: false

    // });

    // setTimeout(function() { document.getElementById('wrapper').style.left = '0'; }, 800);
}
//绘制福鼠
function Ship(ctx) {
    gameMonitor.im.loadImage(['static/images/ratleft.png']);
    this.width = 110;
    this.height = 94;
    this.left = gameMonitor.w / 2 - this.width / 2;
    this.top = gameMonitor.h - 1.3 * this.height;
    this.player = gameMonitor.im.createImage('static/images/ratleft.png');

    this.paint = function() {
        ctx.drawImage(this.player, this.left, this.top, this.width, this.height);
    }

    this.setPosition = function(event) {
        if (gameMonitor.isMobile()) {
            var tarL = event.changedTouches[0].clientX;
            //如果是jquery获取event对象
            //var tarL= event.originalEvent.changedTouches[0].clientX;
            //控制上下滑动
            //var tarT = event.changedTouches[0].clientY;
        } else {
            var tarL = event.offsetX;
            //var tarT = event.offsetY;
        }
        this.left = tarL - this.width / 2 - 16;
        //this.top = tarT - this.height/2;
        if (this.left < 0) {
            this.left = 0;
        }
        if (this.left > window.innerWidth - this.width) {
            this.left = window.innerWidth - this.width;
        }
        // if(this.top<0){
        // 	this.top = 0;
        // }
        // if(this.top>gameMonitor.h - this.height){
        // 	this.top = gameMonitor.h - this.height;
        // }
        this.paint();
    }

    this.controll = function() {
        var _this = this;
        var stage = $('#gamepanel');
        var currentX = this.left,
            currentY = this.top,
            move = false;
        stage.on(gameMonitor.eventType.start, function(event) {
            _this.setPosition(event);
            move = true;
        }).on(gameMonitor.eventType.end, function() {
            move = false;
        }).on(gameMonitor.eventType.move, function(event) {
            event.preventDefault();
            if (move) {
                _this.setPosition(event);
            }

        });
    }

    this.eat = function(foodlist) {
        var _this = this;
        var countDownTime = _this.countDownTime;
        var score = this.score;
        for (var i = foodlist.length - 1; i >= 0; i--) {
            var f = foodlist[i];
            if (f) {
                var l1 = this.top + this.height / 2 - (f.top + f.height / 2);
                var l2 = this.left + this.width / 2 - (f.left + f.width / 2);
                var l3 = Math.sqrt(l1 * l1 + l2 * l2);
                if (l3 <= this.height / 2 + f.height / 2) {
                    foodlist[f.id] = null;
                    if (gameMonitor.countDownTime == 0) {
                        alert('time up');
                    }
                    if (f.type == 0 || gameMonitor.countDownTime == 0) { // 接到炸弹或者倒计时结束
                        gameMonitor.stop();
                        $('#resultPanel').show();
                        gameMonitor.getScore();
                        // setTimeout(function(){
                        // 	$('#resultPanel').show();
                        // 	gameMonitor.getScore();
                        // }, 2000);
                    } else {
                        console.log()
                        $('#score').text(gameMonitor.score = gameMonitor.score + f.scorenums);
                        $('#countDown').text((gameMonitor.countDownTime = (parseInt(gameMonitor.countDownTime) + f.timenums)) + "S");
                        //$('#score').text(++gameMonitor.score);
                        $('.heart').removeClass('hearthot').addClass('hearthot');
                        setTimeout(function() {
                            $('.heart').removeClass('hearthot')
                        }, 200);
                    }
                }
            }

        }
    }
}

function Food(type, left, id) {
    _this = gameMonitor;
    this.speedUpTime = 250;
    this.id = id;
    this.type = type;
    this.width = 70;
    this.height = 50;
    this.left = left;
    this.top = -50;
    this.speed = 0.05 * Math.pow(1.2, Math.floor(gameMonitor.time / this.speedUpTime));
    this.loop = 0;
    this.scorenums = 0;
    this.timenums = 0;
    this.clocknum = 0;
    var iconPudding = ['static/images/clock.png', 'static/images/coin.png', 'static/images/luckbag.png', 'static/images/redpacket.png'];

    var p = this.type == 0 ? 'static/images/bomb.png' : getRandom(iconPudding, 1);
    if ('static/images/clock.png' == p) {
        if (_this.clockNum <= 5) {
            this.clocknum = 1;
            this.scorenums = 0;
            this.timenums = 3;
        } else {
            this.clocknum = 1;
            this.scorenums = 0;
            this.timenums = 0;
        }

    } else if ('static/images/coin.png' == p) {
        this.clocknum = 0;
        this.scorenums = 8;
        this.timenums = 0;
    } else if ('static/images/luckbag.png' == p) {
        this.clocknum = 0;
        this.scorenums = 10;
        this.timenums = 0;
    } else {
        this.clocknum = 0;
        this.scorenums = 5;
        this.timenums = 0;
    }

    this.pic = gameMonitor.im.createImage(p);
}
Food.prototype.paint = function(ctx) {
    if (this.pic) {
        ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
    }

}
Food.prototype.move = function(ctx) {
    if (gameMonitor.time % this.speedUpTime == 0) {
        this.speed *= 1.2;
    }
    this.top += ++this.loop * this.speed;
    if (this.top > gameMonitor.h) {
        gameMonitor.foodList[this.id] = null;
    } else {
        this.paint(ctx);
    }
}

function getRandom(arr, count) {
    var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}



function ImageMonitor() {
    var imgArray = [];
    return {
        createImage: function(src) {
            _this = gameMonitor;
            // var iconPudding0 = ['static/images/coin.png', 'static/images/luckbag.png', 'static/images/redpacket.png'];
            if (src == 'static/images/clock.png') {
                ++_this.clockNum
            }
            if (_this.clockNum > 5 && src == "static/images/clock.png") {
                return;
                // this.timenums = 0;
                // i = iconPudding0.length;
                // arr = iconPudding0.slice(0)
                // index = Math.floor((2) * Math.random());
                // src = arr[index];
            }
            return typeof imgArray[src] != 'undefined' ? imgArray[src] : (imgArray[src] = new Image(), imgArray[src].src = src, imgArray[src])




        },
        loadImage: function(arr, callback) {
            for (var i = 0, l = arr.length; i < l; i++) {
                var img = arr[i];
                imgArray[img] = new Image();
                imgArray[img].onload = function() {
                    if (i == l - 1 && typeof callback == 'function') {
                        callback();
                    }
                }
                imgArray[img].src = img
            }
        }
    }
}


var gameMonitor = {
    w: window.innerWidth,
    h: window.innerHeight / 1,
    bgWidth: window.innerWidth,
    bgHeight: window.innerHeight,
    time: 0,
    timmer: null,
    bgSpeed: 2,
    bgloop: 0,
    score: 0,
    countDownTime: 60,
    countAction: '',
    startcountDownTime: 3,
    im: new ImageMonitor(),
    foodList: [],
    bgDistance: 0, //背景位置
    clockNum: 0, //钟表的次数
    eventType: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
    },
    init: function() {
        var _this = this;
        var canvas = document.getElementById('stage');
        var ctx = canvas.getContext('2d');

        //绘制背景
        var bg = new Image();
        _this.bg = bg;
        bg.onload = function() {
            ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);
        }
        bg.src = 'static/img/bg_1.png';

        _this.initListener(ctx);

        // 根据宽高比调整布局
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var ratio = height / width;
        if (ratio < 1.4) { // ipad
            $('.guide-pageBottom').css('bottom', '0.1rem');
            $('.logo-banner').css('margin-top', '1rem');
            $('.cloud').css('top', '0.4rem');
            $('.join-num').css('margin-top', '0.1rem');
            $('.rules-card').css('top', '0rem');
            $('.prize-card').css('top', '0.5rem');
        } else if (ratio > 2) { // iphoneX
            $('.guide-pageBottom').css('bottom', '1.2rem');
            $('.join-num').css({ 'margin-top': '0.4rem', 'margin-bottom': '0.2rem' });
            $('.guide-pageTop').css('top', '0.3rem');
            $('.logo-banner').css('margin-top', '1.8rem');
            $('.cloud').css('top', '1.5rem');
            $('.rules-card').css('top', '2rem');
            $('.prize-card').css('top', '2rem');
        }

        // 活动锦囊弹窗选项卡切换
        $('.rules-tab li').click(function() {
            var current = $(this).attr('data-id');
            $('.rules-tab').attr('data-active', current);
            $('.rules-pane.' + current).addClass('active').siblings('.rules-pane').removeClass('active');
            if (current == "rank") {
                loaded();
            }
        });

    },
    initListener: function(ctx) {
        var _this = this;
        var body = $(document.body);
        $(document).on(gameMonitor.eventType.move, function(event) {
            event.preventDefault();
        });
        //再次游戏
        body.on(gameMonitor.eventType.start, '.replay, .playagain', function() {
            _this.startcountDownTime = 3;
            _this.clockNum = 0;
            _this.countDownTime = 60;
            _this.reset();
            var startcountdown = document.getElementById("startcountdown");
            startcountdown.style.display = "block";
            $('#resultPanel').hide();
            var canvas = document.getElementById('stage');
            var ctx = canvas.getContext('2d');
            // _this.ship = new Ship(ctx);
            // _this.ship.controll();
            // _this.ship.paint();
            // _this.reset();
            $("#countDown").text(_this.countDownTime + 'S');
            ctx.clearRect(0, 0, gameMonitor.bgWidth, gameMonitor.bgHeight);
            //_this.run(ctx);
            _this.startcountDown(ctx);

        });

        body.on(gameMonitor.eventType.start, '#frontpage', function() {
            $('#frontpage').css('left', '-100%');
        });
        //开始游戏
        body.on(gameMonitor.eventType.start, '#startGame', function() {
            $('#guidePanel').hide();
            $('#giftShowPanel').hide();
            _this.startcountDownTime = 3;
            _this.clockNum = 0;
            _this.countDownTime = 60;
            var startcountdown = document.getElementById("startcountdown");
            startcountdown.style.display = "block";
            // _this.ship = new Ship(ctx);
            // _this.ship.paint();
            // _this.ship.controll();
            // _this.reset();
            //_this.run(ctx);
            $("#countDown").text(_this.countDownTime + 'S');
            ctx.clearRect(0, 0, gameMonitor.bgWidth, gameMonitor.bgHeight);
            _this.startcountDown(ctx);
            //_this.countDown();
        });

        // 显示锦囊
        body.on(gameMonitor.eventType.start, '#showRules', function() {
            $('#rulesPanel').show();
        });

        // 关闭锦囊
        body.on(gameMonitor.eventType.start, '#closeRulePanel', function() {
            $('#rulesPanel').hide();
            _this.startcountDownTime = 3;

            _this.reset();
            //window.location.reload();
        });

        // 显示填写领奖信息
        body.on(gameMonitor.eventType.start, '.rules-pane.mygift .prize-btn', function() {
            $('#rulesPanel').show();
            $('#prizePanel').show();
        });

        // 关闭填写领奖信息
        body.on(gameMonitor.eventType.start, '#closePrizePanel', function() {
            $('#prizePanel').hide();
        });

        // 提交领奖信息
        body.on(gameMonitor.eventType.start, '#btnSubmit', function() {

            var userName = $.trim($('#userName').val());
            var userMobile = $.trim($('#userMobile').val());
            var userAddress = $.trim($('#userAddress').val());
            var userRemarks = $.trim($('#userRemarks').val());
            var userRemarks = $.trim($('#imgRemarks').val());
            if (!(userName)) {
                $(document).dialog({
                    type: 'notice',
                    infoText: '请输入用户姓名',
                    autoClose: 2000
                });
                return;
            }

            if (!(userMobile)) {
                $(document).dialog({
                    type: 'notice',
                    infoText: '请输入用户电话',
                    autoClose: 2000
                });
                return;
            }

            if (!(userAddress)) {
                $(document).dialog({
                    type: 'notice',
                    infoText: '请输入收货地址',
                    autoClose: 2000
                });
                return;
            }
            if (!(userRemarks)) {
                $(document).dialog({
                    type: 'notice',
                    infoText: '请输入手机验证码',
                    autoClose: 2000
                });
                return;
            }
            if (!(imgRemarks)) {
                $(document).dialog({
                    type: 'notice',
                    infoText: '请输入图片验证码',
                    autoClose: 2000
                });
                return;
            }
            // 成功提示
            $(document).dialog({
                type: 'notice',
                infoText: '提交成功',
                autoClose: 2000,
                onClosed: function() {
                    $('#prizePanel').hide();
                    //$('#guidePanel').show();
                    $('#giftShowPanel').show();

                }
            });

        });

        // 返回首页
        body.on(gameMonitor.eventType.start, '#btnReturn', function() {
            $('#resultPanel').hide();
            $('#guidePanel').show();
        });

        // 查看排行榜
        body.on(gameMonitor.eventType.start, '#btnRank', function() {
            $('#resultPanel').hide();
            $('#guidePanel').show();
            $('#rulesPanel').show();
            $('.rules-tab li[data-id=rank]').trigger('click');
            loaded();
        });

        //查看我的金币
        body.on(gameMonitor.eventType.start, '#showCoins', function() {
            $('#resultPanel').hide();
            $('#guidePanel').show();
            $('#rulesPanel').show();
            $('.rules-tab li[data-id=mycoin]').trigger('click');
            loaded();
        });
        //查看助力
        body.on(gameMonitor.eventType.start, '#showHelp', function() {
            $('#helpsPanel').show();
            $('#guidePanel').show();
            $('#resultPanel').hide();
            $('#gamePanel').hide();

        });
        body.on(gameMonitor.eventType.start, '#showHelp0', function() {
            $('#helpsPanel').show();
            $('#guidePanel').show();
            $('#resultPanel').hide();
            $('#gamePanel').hide();

        });
        // 关闭助力
        body.on(gameMonitor.eventType.start, '#closehelpsPanel', function() {
            //window.location.reload();
            $('#helpsPanel').hide();
            _this.startcountDownTime = 3;
            _this.reset();
        });
        //关闭领取奖品页
        body.on(gameMonitor.eventType.start, '#closegiftShowPanel', function() {
            $('#giftShowPanel').hide();
        });

        //分享代码

        // body.on(gameMonitor.eventType.start, '.share', function(){
        // 	$('.weixin-share').show().on(gameMonitor.eventType.start, function(){
        // 		$(this).hide();
        // 	});
        // });

        // WeixinApi.ready(function(Api) {   
        //           // 微信分享的数据
        //           //分享给好友的数据
        //           var wxData = {
        //               "appId": "", 
        //               "imgUrl" : "static/img/icon.png",
        //               "link" : "",
        //               "desc" : "进击的龙舟",
        //               "title" : "“玩龙舟 接粽子”"
        //           };

        //           //朋友圈数据
        //           var wxDataPyq ={
        //           	"appId": "",
        //               "imgUrl" : "static/img/icon.png",
        //               "link" : "",
        //               "desc" : "“玩龙舟 接粽子”",
        //               "title" : "进击的龙舟"
        //           }

        //           // 分享的回调
        //           var wxCallbacks = {
        //               // 分享操作开始之前
        //               ready : function() {},
        //               cancel : function(resp) {},
        //               fail : function(resp) {},
        //               confirm : function(resp) {},
        //               all : function(resp) {
        //                   //location.href=location.href
        //               }
        //           };

        //           // 用户点开右上角popup菜单后，点击分享给好友，会执行下面这个代码
        //           Api.shareToFriend(wxData, wxCallbacks);
        //           // 点击分享到朋友圈，会执行下面这个代码
        //           Api.shareToTimeline(wxDataPyq, wxCallbacks);
        //           // 点击分享到腾讯微博，会执行下面这个代码
        //           Api.shareToWeibo(wxData, wxCallbacks);
        //       });

    },
    startcountDown: function(ctx) {

        var _this = this;
        var startcountdown = document.getElementById("startcountdown");
        $("#startcountdown").text(_this.startcountDownTime);
        var test = setInterval(function() {

            console.log(_this.startcountDownTime)
            $("#startcountdown").text(--_this.startcountDownTime);
            if (_this.startcountDownTime == -1) {
                //等于0时清除计时se";
                startcountdown.style.display = "none";
                console.log("开始")
                _this.ship = new Ship(ctx);
                _this.ship.paint();
                _this.ship.controll();
                _this.run(ctx);
                _this.reset();
                _this.countDown();
                clearInterval(test)
            }
        }, 1000)

    },
    rollBg: function(ctx) {
        if (this.bgDistance >= this.bgHeight) {
            this.bgloop = 0;
        }
        this.bgDistance = ++this.bgloop * this.bgSpeed;
        ctx.drawImage(this.bg, 0, this.bgDistance - this.bgHeight, this.bgWidth, this.bgHeight);
        ctx.drawImage(this.bg, 0, this.bgDistance, this.bgWidth, this.bgHeight);
    },
    countDown: function() {
        var _this = gameMonitor;
        var countTotal = _this.countDownTime;
        $("#countDown").text(_this.countDownTime + 'S');

        _this.countAction = setInterval(function() {
            $("#countDown").text(_this.countDownTime-- + 'S');
            if (_this.countDownTime == -1) {
                clearInterval(_this.countAction);
                _this.stop();
                $('#resultPanel').show();
                _this.getScore();
            }
        }, 1000);

        // setTimeout(function() {
        //     //$("#countDown").text('0S');            
        //     clearInterval(_this.countAction);
        // }, countTotal * 1000);

    },
    run: function(ctx) {
        var _this = gameMonitor;
        ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
        _this.rollBg(ctx);

        //绘制福鼠
        _this.ship.paint();
        _this.ship.eat(_this.foodList);


        //产生福包
        _this.genorateFood();

        //绘制福包
        //debugger
        for (i = _this.foodList.length - 1; i >= 0; i--) {
            var f = _this.foodList[i];
            if (f) {
                //f.paint(ctx);
                f.move(ctx);
            }

        }
        _this.timmer = setTimeout(function() {
            gameMonitor.run(ctx);
        }, 16);

        _this.time++;


    },
    stop: function() {
        var _this = this
        $('#stage').off(gameMonitor.eventType.start + ' ' + gameMonitor.eventType.move);
        setTimeout(function() {
            clearTimeout(_this.timmer);
        }, 0);

        setTimeout(function() {
            clearTimeout(_this.countAction);
        }, 0);

    },
    genorateFood: function() {
        var genRate = 25; //产生福包的频率
        var random = Math.random();
        if (random * genRate > genRate - 1) {
            var left = Math.random() * (this.w - 25);
            // var type = Math.floor(left)%2 == 0 ? 0 : 1;
            var rdm = Math.round(Math.random() * 100);
            var type = rdm > 20 ? 1 : 0;
            var id = this.foodList.length;
            var f = new Food(type, left, id);
            this.foodList.push(f);
        }
    },
    reset: function() {
        this.foodList = [];
        this.bgloop = 0;
        this.score = 0;
        this.timmer = null;
        this.time = 0;
        this.countDownTime = 60;
        $('#score').text(this.score);
        if (gameMonitor && gameMonitor.countAction) {
            clearInterval(gameMonitor.countAction);
        }

    },
    getScore: function() {
        var time = Math.floor(this.time / 60);
        var score = this.score;

        $('#gameScore').text(score);
        // var user = 1;
        // if(score==0){
        // 	$('#scorecontent').html('真遗憾，您竟然<span class="lighttext">一个</span>粽子都没有接到！');
        // 	$('.btn1').text('大侠请重新来过').removeClass('share').addClass('playagain');
        // 	//$('#fenghao').removeClass('geili yinhen').addClass('yinhen');
        // 	return;
        // }
        // else if(score<10){
        // 	user = 2;

        // }
        // else if(score>10 && score<=20){
        // 	user = 10;
        // }
        // else if(score>20 && score<=40){
        // 	user = 40;
        // }
        // else if(score>40 && score<=60){
        // 	user = 80;
        // }
        // else if(score>60 && score<=80){
        // 	user = 92;
        // }
        // else if(score>80){
        // 	user = 99;
        // }
        // $('#fenghao').removeClass('geili yinhen').addClass('geili');
        // $('#scorecontent').html('您在<span id="stime" class="lighttext"></span>秒内抢到了<span id="sscore" class="lighttext"></span>个粽子<br>超过了<span id="suser" class="lighttext"></span>的用户！');
        // $('#stime').text(time);
        // $('#sscore').text(score);
        // $('#suser').text(user+'%');
        // $('.btn1').text('请小伙伴一起接粽子').removeClass('playagain').addClass('share');
    },
    isMobile: function() {
        var sUserAgent = navigator.userAgent.toLowerCase(),
            bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
            bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
            bIsMidp = sUserAgent.match(/midp/i) == "midp",
            bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
            bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
            bIsAndroid = sUserAgent.match(/android/i) == "android",
            bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
            bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile",
            bIsWebview = sUserAgent.match(/webview/i) == "webview";
        return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
    }
}
if (!gameMonitor.isMobile()) {
    gameMonitor.eventType.start = 'mousedown';
    gameMonitor.eventType.move = 'mousemove';
    gameMonitor.eventType.end = 'mouseup';
}

gameMonitor.init();