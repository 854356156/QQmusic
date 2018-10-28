$(function () {
    //滚动条
    $(".song_muen").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var lyric;

    //音乐进度条
    var $probarbg = $(".pro_bar_bg");
    var $probarline = $(".pro_bar_line");
    var $probardot = $(".pro_bar_dot");
    var progress = Progress($probarbg,$probarline,$probardot);
    progress.ProgressClick(function(value){
        player.musicTo(value)
    });
    progress.ProgresssMove(function (value) {
        player.musicTo(value)
    });

    //音量进度条
    var $volumebar = $(".volume_bar");
    var $volumeline = $(".volume_line");
    var $volumedot = $(".volume_dot");
    var volumeProgress = Progress($volumebar,$volumeline,$volumedot);
    volumeProgress.ProgressClick(function(value){
        player.musicVolume(value)
    });
    volumeProgress.ProgresssMove(function (value) {
        player.musicVolume(value)
    });

    //加载歌曲列表
    getPlayerList();
    function getPlayerList(index){
        var indexs = 0
        if(index>0){
            indexs = index
        }
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function(data){
                player.musicList = data;
                //3.1遍历获取的数据，创建每一条音乐
                var $MusicList = $(".song_muen ul");
                $.each(data, function (index,ele) {
                    var $item = crateMusicItem(index,ele);
                    $MusicList.append($item)
                })

                InfoMusic(data[indexs]);
                InfoMusicLyric(data[indexs]);
            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    //初始化歌曲信息
    function InfoMusic(music){
        //右边信息歌曲名
        $(".song_info_name span").text(music.name);
        //右边信息歌手名
        $(".song_info_singer span").text(music.singer);
        //右边信息专辑名
        $(".song_info_album span").text(music.album);
        //右边信息专辑图
        $(".right_cover img").attr("src",music.cover);

        //底部播放条歌名-歌手
        $(".pro_info_name").text(music.name+" - "+music.singer)
        //底部播放条时间
        $(".pro_info_time").text("00:00 / "+music.time)

        $(".mask_bg").css("background","url('"+ music.cover +"')")

    }
    function lyricMusic(music){

    }

    //初始化歌词
    function InfoMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        var lyricList = $(".right_lyrics");
        var pure_lyricList = $(".pure_list");
        lyricList.html("");
        pure_lyricList.html("");
        lyric.loadmusic(function () {
            //创建歌词列表
            $.each(lyric.lyrics, function (index,ele) {
                var $item = $("<li>"+ele+"</li>")
                lyricList.append($item)
            })
        })
    }


    initEvents()
    function initEvents(){
        //歌曲内按钮显示隐藏
        $(".song_muen").delegate(".song_list","mouseenter", function () {
            $(this).find(".song_name_icon").stop().fadeIn(100);
            $(this).find(".song_time span").stop().fadeOut(0);
            $(this).find(".song_time i").stop().fadeIn(100);
        })
        $(".song_muen").delegate(".song_list","mouseleave", function () {
            $(this).find(".song_name_icon").stop().fadeOut(100);
            $(this).find(".song_time span").stop().fadeIn(0);
            $(this).find(".song_time i").stop().fadeOut(0);
        })
        //歌曲选中取消
        $(".song_muen").delegate(".song_chek","click", function () {
            $(this).find("i").toggleClass("song_chek_bg")
        })
        //播放按钮切换
        var $musicPlay = $(".play");
        $(".song_muen").delegate(".icon_play","click",function(){
            var $item = $(this).parents(".song_list");
            $(this).toggleClass("icon_play2");
            $(this).parents(".song_list").siblings().find(".icon_play").removeClass("icon_play2");
            //底部同步按钮
            if($(this).attr("class").indexOf("icon_play2") != -1){
                $musicPlay.addClass("play2");
                $(this).parents(".song_list").find("div").css("color","white");
            }else {
                $musicPlay.removeClass("play2");
                $(this).parents(".song_list").find("div").css("color","rgba(255,255,255, 0.5)");
            };
            //切换序号顺序
            $(this).parents(".song_list").find(".song_number").toggleClass("song_number2")
            $(this).parents(".song_list").siblings().find(".song_number").removeClass("song_number2")
            $(this).parents(".song_list").siblings().find("div").css("color","rgba(255,255,255, 0.5)");

            //播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);
            //切换歌曲信息
            InfoMusic($item.get(0).music)

        });

        //底部播放按钮
        $musicPlay.click(function () {
            if(player.curr === -1){
                //没有播放过音乐
                $(".song_list").eq(0).find(".icon_play").trigger("click");
            }else {
                //已经播放过音乐
                $(".song_list").eq(player.curr).find(".icon_play").trigger("click");
            };
        });
        //底部上一首按钮
        $(".pre").click(function () {
            $(".song_list").eq(player.preMusic()).find(".icon_play").trigger("click");
            getPlayerList(player.curr)
        });
        //底部下一首按钮
        $(".next").click(function () {
            $(".song_list").eq(player.nextMusic()).find(".icon_play").trigger("click");
            getPlayerList(player.curr)
        });

        //删除歌
        $(".song_muen").delegate(".song_del","click", function () {
            //被点击的音乐
            var $item = $(this).parents(".song_list");
            //判断当前删除的是否正在播放
            if($item.get(0).index === player.curr){
                $(".next").trigger("click");
            }
            $item.remove();
            //删除json数据的歌
            player.delMusic($item.get(0).index)
            //重新排序
            $(".song_list").each(function(index,ele){
                ele.index = index
                $(ele).find(".song_number").text(index + 1)
            })
        })
        //进度条同步事件
        //duration：总事件，currentTime：当前时间，time：00:00/04:00
        player.musicTimeUpdate(function (duration,currentTime,time) {
            //同步时间
            $(".pro_info_time").text(time)
            //同步进度条
            var value = currentTime / duration *100;
            progress.setProgress(value)
            var index = lyric.lyriccurrent(currentTime)
            var $item = $(".right_lyrics").eq(0).find("li").eq(index)
            var $item_pure = $(".right_lyrics").eq(1).find("li").eq(index)
            //var $item = $(".right_lyrics li").eq(index);
            $item.addClass("right_lyrics_bg");
            $item_pure.addClass("right_lyrics_bg");
            $item.siblings().removeClass("right_lyrics_bg");
            $item_pure.siblings().removeClass("right_lyrics_bg");

            if(index<=3) return
            $(".right_lyrics").css({
                marginTop: (-index+3) * 30
            })
        })

        //控制音量
        $(".volume_icon").click(function () {
            $(this).toggleClass("volume_icon2")
            if($(this).attr("class").indexOf("volume_icon2") != -1){
                //变没有声音
                player.musicVolume(0)
            }else {
                //变有声音
                player.musicVolume(1)
            }
        })

        //纯净模式切换
        $(".pure").click(function () {
            $(this).toggleClass("pure2")
            if($(this).attr("class").indexOf("pure2") != -1){
                //开启纯净模式
                $(".contents").css("display","none")
                $(".contents_pure").css("display","block")
            }else {
                //关闭纯净模式
                $(".contents").css("display","block")
                $(".contents_pure").css("display","none")
            }
        })

        //播放循序
        $(".play_mode").click(function () {
            $(this).toggleClass("play_mode2")
            if($(this).attr("class").indexOf("play_mode2") != -1){
                //设置单曲循环
                $(".audio_music").attr("loop","loop")
            }else {
                //取消单曲循环
                $(".audio_music").removeAttr("loop","loop")
            }
        })
        //播放模式,列表循环、单曲循环
        $(".audio_music").get(0).onended = function () {audio_end()}
        function audio_end(){
            if($(".play_mode").get(0).getAttribute("class").indexOf("play_mode2") != -1){
                //单曲循环
            }else {
                //列表循环
                $(".next").trigger("click")
            }

        }
    }



    //定义一个方法创建一条音乐
    function crateMusicItem(index,ele){
        var $item = $("" +
            "<li class=\"song_list\">\n" +
            "<div class=\"song_chek\"><i></i></div>\n" +
            "<div class=\"song_number\">"+ (index+1) +"</div>\n" +
            "<div class=\"song_name\">"+ele.name+ "" +
            "     <div class=\"song_name_icon\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='icon_play' ></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"song_singer\">"+ ele.singer +"</div>\n" +
            "<div class=\"song_time\">\n" +
            "     <span>"+ ele.time +"</span>\n" +
            "     <i class='song_del'></i>\n" +
            "</div>\n" +
            "</li>")

        $item.get(0).index = index;
        $item.get(0).music = ele;
        return $item
    }

})