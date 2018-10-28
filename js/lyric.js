(function (window) {
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor:Lyric,
        timetotal:[],
        lyrics:[],
        index:-1,
        init: function (path) {
            this.path = path
        },
        loadmusic: function (callBakc){
            var $this = this
            $.ajax({
                url: this.path,
                dataType: "text",
                success: function(data){
                    $this.lyricParse(data);
                    callBakc()
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        lyricParse: function(data){
            var $this = this;
            $this.timetotal = [];
            $this.lyrics = [];
            var array = data.split("\n");
            var timeReg = /\[(\d*\:\d*\.\d*)\]/;

            //遍历每一条歌词
            $.each(array, function (index,ele) {
                //筛选歌词
                var lyric = ele.split("]")[1];
                //排除空歌词
                if(lyric.length == 1) return true
                //将歌词添加到数组
                $this.lyrics.push(lyric)
                //筛选出符合正则表达式的时间
                var res = timeReg.exec(ele);
                if(res == null) return true;
                //获取时间
                var time = res[1];
                //切割时间，分开分钟和秒
                var res2 = time.split(":");
                //获取分钟，转换成秒
                var min = parseInt(res2[0] * 60);
                //获取秒
                var sec = parseFloat(res2[1]);
                var time2 = Number(min + sec).toFixed(2);
                $this.timetotal.push(time2);

            })
        },
        lyriccurrent: function (currentTime) {

            var index = -1
            if(currentTime >= this.timetotal[0]){
                this.index++
                this.timetotal.shift()
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype
    window.Lyric = Lyric;
})(window)