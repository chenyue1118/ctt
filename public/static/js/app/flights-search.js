$(function() {

  // TODO: 2019-05-10  根据时间渲染
  showTimeList('2019-05-30')

  // 弹出 反馈错误窗口
  $(".report").on("click", function() {
    $(".mask_").show();
    $(".report-mask").show();
  });

  // 关闭 反馈错误窗口
  $(".seize-close").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });
  // 关闭 反馈错误窗口
  $(".mask_").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });
  // 关闭 反馈错误窗口
  $(".report-btn .btn").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });

  // start
  // 时间选择
  $(".screen-time").on("click", ".item", function() {
    var time_ = $(this).attr("data-time");
    $(".screen-time .item").removeClass("active");
    $(this).addClass("active");
  });


  // ==========================================================

  //根据时间 显示  time 列表   --> 判断
  function showTimeList(time){               // time -> 2018-01-20
    var time = time.replace(/-/g,"/");
    $(".screen-time .item").remove();          //删除原有的记录
    var time1 = Date.parse(time);
    var time2 = Date.parse(time+" 23:59:59");
    var nowDate = Date.parse(new Date());
    var timeDiff = parseInt(time2) - parseInt(nowDate);
    //  当天  第二天  第三天  大于三天
    if(timeDiff < 24*60*60*1000){
      timeItem(time1, "active");
      for (var i = 1; i < 7; i++) {
        timeItem(parseInt(time1)+24*60*60*1000*i);
      }
    }else if(timeDiff>24*60*60*1000 && timeDiff<24*60*60*1000*2){
      timeItem(parseInt(time1)-24*60*60*1000);
      timeItem(parseInt(time1), "active");
      for (var i = 1; i < 6; i++) {
        timeItem(parseInt(time1)+24*60*60*1000*i);
      }
    }else if(timeDiff>24*60*60*1000*2 && timeDiff<24*60*60*1000*3){
      timeItem(parseInt(time1)-24*60*60*1000*2);
      timeItem(parseInt(time1)-24*60*60*1000);
      timeItem(parseInt(time1), "active");
      for (var i = 1; i < 5; i++) {
        timeItem(parseInt(time1)+24*60*60*1000*i);
      }
    }else if(timeDiff>24*60*60*1000*3){
      timeItem(parseInt(time1)-24*60*60*1000*3);
      timeItem(parseInt(time1)-24*60*60*1000*2);
      timeItem(parseInt(time1)-24*60*60*1000);
      timeItem(parseInt(time1), "active");
      for (var i = 1; i < 4; i++) {
        timeItem(parseInt(time1)+24*60*60*1000*i);
      }
    }
  }

  //根据时间 显示  time 列表  --> 获取具体元素
  function timeItem(num, active){
    var num = num;                           //毫秒数
    var active = active || "";
    if(active) active = "active";
    var getDate = new Date(num);
    var getYear = getDate.getFullYear();
    var getY = getDate.getMonth() + 1;      //1 -> 一月份
    var getW = getDate.getDay();            //0 -> 星期天  1 -> 星期一
    var getD = getDate.getDate();           //1 -> 1号
    var data_time = getYear + "-" + (getY > 9 ? getY : "0" + getY) + "-" +(getD > 9 ? getD : "0" + getD);
    var itemStr = '<li class="item '+active+'" data-time="'+data_time+'">'+getMonEn(getY)+' '+getD+','+getWeekEn(getW)+'</li>';
    $(".screen-time").append(itemStr);
  }

  //转换月份  1 --> January
  function getMonEn(str){
    var mon;
    var str = parseInt(str);
    switch (str) {
      case 1:
        mon = "Jan";
        break;
      case 2:
        mon = "Feb";
        break;
      case 3:
        mon = "Mar";
        break;
      case 4:
        mon = "Apr";
        break;
      case 5:
        mon = "May";
        break;
      case 6:
        mon = "June";
        break;
      case 7:
        mon = "July";
        break;
      case 8:
        mon = "Aug";
        break;
      case 9:
        mon = "Sep";
        break;
      case 10:
        mon = "Oct";
        break;
      case 11:
        mon = "Nov";
        break;
      case 12:
        mon = "Dec";
        break;
    }
    return mon;
  }

  //转换星期  0 --> Sunday
  function getWeekEn(str){
    var week;
    var str = parseInt(str);
    switch (str) {
      case 0:
        week = "Sun";
        break;
      case 1:
        week = "Mon";
        break;
      case 2:
        week = "Tues";
        break;
      case 3:
        week = "Wednes";
        break;
      case 4:
        week = "Thurs";
        break;
      case 5:
        week = "Fri";
        break;
      case 6:
        week = "Satur";
        break;
    }
    return week;
  }

});
