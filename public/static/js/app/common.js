// api地址
var APIURL = "http://123.57.18.91:1002";

// 计算签名的方法返回数据
function getSign(type) {
  var terminal = 1;
  var time_stamp = getTime();
  var random = 10000 + parseInt(Math.random()*10000);
  var key = "abc@123!";
  var sign =  "random="+random+"&timestamp="+time_stamp+"&terminal="+terminal;
  sign = sign.MD5(32);
  sign = CryptoJS.HmacSHA256(sign, key).toString();
  if (type == 'get') {
    return 'terminal='+terminal+'&time_stamp='+time_stamp+'&random='+random+'&sign='+sign;
  } else if (type == 'post') {
    return {
      terminal: terminal,
      time_stamp: time_stamp,
      random: random,
      sign: sign
    };
  } else {
    return null;
  }
}

// 获取时间--UTC  getTime()=>20180117081022  getTime(2)=>2018-01-18 12:15:55
function getTime(index){
  var num = index || "format";
  var data = new Date();
  var year_ = data.getUTCFullYear();
  var month_ = (data.getUTCMonth()+1) > 9 ? data.getUTCMonth()+1 : '0'+(data.getUTCMonth()+1);
  var date_ = data.getUTCDate() > 9 ? data.getUTCDate() : '0'+data.getUTCDate();
  var hours_ = data.getUTCHours() > 9 ? data.getUTCHours() : '0'+data.getUTCHours();
  var minutes_ =data.getUTCMinutes() > 9 ? data.getUTCMinutes() : '0'+data.getUTCMinutes();
  var seconds_ = data.getUTCSeconds() > 9 ? data.getUTCSeconds() : '0'+data.getUTCSeconds();
  var time_ = year_+''+month_+''+date_+''+hours_+''+minutes_+''+seconds_;
  var time_format = year_+'-'+month_+'-'+date_+' '+hours_+':'+minutes_+':'+seconds_;
  if(num == "format"){
    return time_;
  }else{
    return time_format;
  }
}

$(function() {
  $(".home-icon").on("click", function() {
    location.href = "/";
  });
  $(".nav-icon").on("click", function() {
    location.href = "/";
  });
});
