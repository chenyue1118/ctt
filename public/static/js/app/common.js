// api地址
var APIURL = "http://123.57.18.91:1002";
// var APIURL_US = "http://64.50.179.18";
var APIURL_US = "http://123.57.18.91:1002";
// 汇率
var ExchangeRate = 6.9;
// 服务费
var ServiceFee = 50;

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

// 车站首字母大写    正则法
function firstCap(str){
  str = str.toLowerCase();
  var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
  return str.replace(reg,function(m){
    return m.toUpperCase()
  });
}

// 获取座位
function getSeat (type) {
  var seat = "";
  switch (type) {
    case "O":
      seat = "2nd Cls."
      break;
    case "M":
      seat = "1nd Cls."
      break;
    case "9":
      seat = "Business Cls"
      break;
    case "F":
      seat = "CRH Berth"
      break;
    case "4":
      seat = "Soft Sleeper"
      break;
    case "3":
      seat = "Hard Sleeper"
      break;
    case "1":
      seat = "Soft Seat"
      break;
  }
  return seat;
}

// 获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

// 美元换算
function priceExchangeRate(num1, num2) {
  return (num1 / num2).toFixed(2);
}

// 写cookies  默认是保存30天
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path= /;expires=" + exp.toGMTString();
}

// 读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

$(function() {
  $(".home-icon").on("click", function() {
    location.href = "/";
  });
  $(".nav-icon").on("click", function() {
    location.href = "/";
  });
});
