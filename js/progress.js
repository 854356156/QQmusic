(function (window) {
    function Progress($probarbg,$probarline,$probardot){
        return new Progress.prototype.init($probarbg,$probarline,$probardot);
    }
    Progress.prototype = {
        constructor:Progress,
        ismove:false,
        init: function ($probarbg,$probarline,$probardot) {
            this.$probarbg = $probarbg;
            this.$probarline = $probarline;
            this.$probardot = $probardot;
        },
        ProgressClick: function (callback) {
            var $this = this
            this.$probarbg.click(function (e) {
                //背景图片距离左边窗口的距离
                var initLeft = $(this).offset().left
                //鼠标点击位置距离左边窗口的距离
                var ClickLeft = e.pageX
                $this.$probarline.css("width",ClickLeft - initLeft)
                $this.$probardot.css("left",ClickLeft - initLeft)
                //计算进度条比例
                var value = (ClickLeft - initLeft) / $(this).width()
                console.log(value);
                callback (value)
            })
        },
        ProgresssMove: function (callback) {
            var $this = this
            var ClickLeft;
            var bgwidth = this.$probarbg.width()
            //背景图片距离左边窗口的距离
            var initLeft = this.$probarbg.offset().left
            //监听鼠标点击
            $this.$probarbg.mousedown(function () {
                $this.ismove = true
                //监听鼠标移动
                $(document).mousemove(function(e){
                    //鼠标点击位置距离左边窗口的距离
                    ClickLeft = e.pageX
                    if(ClickLeft - initLeft >0 && ClickLeft - initLeft < bgwidth){
                        $this.$probarline.css("width",ClickLeft - initLeft)
                        $this.$probardot.css("left",ClickLeft - initLeft)
                    }


                })

            })
            //监听鼠标抬起
            $(document).mouseup(function () {
                $(document).off("mousemove")
                this.ismove= false
                var value = (ClickLeft - initLeft) / $this.$probarbg.width()
                callback(value)
            })
        },
        setProgress: function (value) {
            if(this.ismove) return
            if(value<0 || value >100) return;
            this.$probarline.css({
                width: value+"%"
            })
            this.$probardot.css({
                left: value+"%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype
    window.Progress = Progress;
})(window)