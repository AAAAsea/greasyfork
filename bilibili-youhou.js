// ==UserScript==
// @name         bilibili/B站倍速控制优化
// @namespace    https://greasyfork.org/zh-CN/users/782923-asea
// @version      1.0.1
// @description  '+'、'-'控制倍速；'alt'+'[1-9]' 选择快速选择整数倍速；若无效请单击播放窗口一次再尝试，若仍无效请刷新页面；仍有bug请留言反馈
// @author       Asea Q:569389750
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPL-3.0-only
// ==/UserScript==

(function() {
  var old_url = window.location.href; // 获取当前url，方便后面换课时调用
  var errors = 0
  mainfn = setInterval(mianKeybind, 500);
  function mianKeybind(){
      if(document.readyState == 'complete') // 判断网页资源加载完毕
      { 
        urlfn = setInterval(url_listener, 1000)  // 监听url变化
        var rate = 0.2; // 倍速增长量，倍速最低0.2，最高16
        try
        {
        videoElement = document.querySelector('video')
        videoElement.click()
        document.onkeydown = keybind // 绑定键盘事件
        function keybind(event)   
        {//键盘事件
          var e = event || window.event || arguments.callee.caller.arguments[0];
          //鼠标上下键控制视频音量
          if(e &&(e.key === '=' || e.key === '+')) 
          {
            // 按加号键 倍速增加
            rateButton = document.querySelector('.bilibili-player-video-btn.bilibili-player-video-btn-speed button')
            videoElement.playbackRate <= 16 -rate ? videoElement.playbackRate = (videoElement.playbackRate+rate).toFixed(1) : 1;
            rateButton.textContent = videoElement.playbackRate.toFixed(1).toString() + 'x'
            return false;
          } else if(e && e.key === '-') 
          {
            // 按减号键 倍速减少
            rateButton = document.querySelector('.bilibili-player-video-btn.bilibili-player-video-btn-speed button')
            videoElement.playbackRate > rate ? videoElement.playbackRate = (videoElement.playbackRate-rate).toFixed(1) : 1;
            rateButton.textContent = videoElement.playbackRate.toFixed(1).toString() + 'x'
            return false;
          } else if(e && e.altKey && '123456789'.search(e.key) != -1) 
          {
            // 整数倍速
            rateButton = document.querySelector('.bilibili-player-video-btn.bilibili-player-video-btn-speed button')
            videoElement.playbackRate > 0 && videoElement.playbackRate <= 16 ? videoElement.playbackRate = Number(e.key) : 1;
            rateButton.textContent = videoElement.playbackRate.toFixed(1).toString() + 'x'
            return false;
          }
        };
        console.log('Done') // 总事件绑定完毕
        clearInterval(mainfn); // 关闭加载元素的定时监听
        }
        catch
        { 
          errors += 1
          if(errors < 20){
          console.log('Loading') // 元素未加载出来时
          }
          else if (errors > 20){ 
            console.log('未发现video元素，已关闭监听')
            clearInterval(mainfn)
          }
        }
      }
    }
    
    function url_listener()
    { 
      var now_url = window.location.href; // 当前url
      if (now_url !== old_url) // 判断是否换节课
      { 
        errors = 0
        clearInterval(mainfn)
        console.log('发现url切换')
        old_url = now_url;
        mainfn = setInterval(mianKeybind, 500); // 开启主定时任务
        clearInterval(urlfn); // 关闭url监听定时任务
      }
    }
})();