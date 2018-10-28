(function (window) {
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        curr: -1,
        init: function ($audio) {
            this.$audio = $audio
            this.audio = $audio.get(0)

        },

        playMusic: function(index, music){
            //判断是否同一首
            if(this.curr == index){
                //同一首
                if(this.audio.paused){
                    this.audio.play();
                }else {
                    this.audio.pause();
                }
            }else {
                //不是同一首
                this.$audio.attr("src",music.link_url)
                this.audio.play();
                this.curr = index;
            }
        },
        preMusic: function () {
            var index = this.curr - 1
            if(index < 0){
                index = this.musicList.length-1
            }
            return index;
        },
        nextMusic: function () {
            var index = this.curr + 1;
            if(index > this.musicList.length-1){
                index = 0
            }
            return index;
        },
        delMusic: function (index) {
            this.musicList.splice(index,1)

            //判断删除的是否当前播放的前面的歌
            if(index < this.curr){
                this.curr -= 1
            }
        },
        musicTimeUpdate: function (callback) {
            var $this = this;
            var duration;
            var currentTime;
            this.$audio.on("timeupdate", function () {
                duration = $this.audio.duration;
                currentTime = $this.audio.currentTime;
                var time = $this.fromdate(duration,currentTime)
                callback(duration,currentTime,time)
            })

        },
        fromdate: function (duration,currentTime) {
            if(isNaN(duration)) return;
            var endmin = parseInt(duration / 60);
            var endsec = parseInt(duration % 60);
            if(endmin<10){
                endmin = "0"+endmin
            }
            if(endsec<10){
                endsec = "0"+endsec
            }
            var stamin = parseInt(currentTime / 60);
            var stasec = parseInt(currentTime % 60);
            if(stamin<10){
                stamin = "0"+stamin
            }
            if(stasec<10){
                stasec = "0"+stasec
            }
            return stamin+":"+ stasec+" / "+ endmin+":"+ endsec
        },
        musicTo: function(value){
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value
        },
        musicVolume: function (value) {
            if(isNaN(value)) return;
            if(value<0 || value>1) return;
            this.audio.volume = value
        }
    }
    Player.prototype.init.prototype = Player.prototype
    window.Player = Player;
})(window)