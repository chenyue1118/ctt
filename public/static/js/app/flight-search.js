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
  // Test()
  function Test() {
    var data = {
      "type": "af4d1624-03ae-445f-8504-05443dcea729",
      "token": null,
      "train_date": "2019-08-18",
      "is_accept_standing": "no",
      "choose_seats": "",
      "from_station_name": "北京",
      "from_station_code": "PEK",
      "to_station_name": "上海",
      "to_station_code": "AOH",
      "checi": "CA155",
      "passengers": [
        {
          "passengerid": 1,
          "passengersename": "CHENXIAO",
          "piaotype": 1,
          "piaotypename": "成人票",
          "passporttypeseid": "B",
          "passporttypeseidname": "护照",
          "passportseno": "12345678",
          "price": 1490,
          "zwcode": "Y",
          "zwname": "经济舱"
        }
      ],
      "start_time": "06:43",
      "arrive_time": "12:40",
      "run_time": "05:57",
      "run_time_minute": 357,
      "arrive_days": 0,
      "distance": 120,
      "delivery_method": 1,
      "delivery_address": {
        "HotelName": "dsadsa",
        "HotelAddress": "dsada",
        "HotelPhone": 123456,
        "BookName": "dsadas",
        "CheckInDate": "2019-01-10",
        "CheckOutDate": "2019-01-10",
        "HomeAddress": "",
        "ReceiverName": "",
        "ReceiverPhone": ""
      },
      "email": "1023581658@qq.com",
      "phone_number": "15600121178",
    }
    data = Object.assign(data, getSign("post"))
    // return false;
    $.ajax({
      url:  APIURL + "/api/order/aircreate",
      data: data,
      dataType: 'json',
      type: 'post',
      success: function(data) {
        console.log(data);
      }
    })
  }

  // TODO: 查询订单
  Search()
  function Search() {
    $.ajax({
      url: APIURL + "/api/order/queryV2?order_number="+"CTT20190815203733864"+"&email="+"1023581658@qq.com"+"&phone_number=" +"15600121178"+ getSign("get"),
      dataType: "json",
      type: "get",
      success: function(data) {
        console.log(data);
      }
    })
  }

  flightSearch('PEK', 'SHA', '2019-08-30')
  // 飞机票搜索
  function flightSearch(from, to, time) {
    var url_ = APIURL + '/api/ticket/queryFlights?StartAirportCode=' + from + '&EndAirportCode=' + to + '&StartDate=' + time + '&StartTime=0000&SeatClass=ALL&AirlineCode=ALL'
    $.ajax({
      url: url_,
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.code == 1) {
          showFlight(data.data);
        }
      }
    });
  }

  // 显示飞机票列表
  function showFlight(data) {
    console.log(data);
    var str = '';
    data && data.forEach(function(item) {
      console.log(item);
      var str1 = '<li class="item">'
        +'<div class="flight-info">'
          +'<div class="info-name">'
            +'<i class="icon-flight-name"></i>'
            +'<span class="txt-flight-name">'+item.FlightNo+'</span>'
          +'</div>'
          +'<div class="flight-aircraft">'
            // +'Aircraft: 33H'
            +'AirportTax:'+item.AirportTax
          +'</div>'
          +'<div class="flight-desc">'
            +'<div class="flight-desc-wra">'
              +'<span class="flight-desc-txt">China Southern Airlines</span>'
            +'</div>'
          +'</div>'
        +'</div>'
        +'<div class="lines">'
          +'<span class="from"></span>'
          +'<span class="line"></span>'
          +'<span class="to"></span>'
        +'</div>'
        +'<div class="time">'
          +'<span class="from">'+item.DepTime.substr(0, 2)+':'+item.DepTime.substr(2, 2)+'</span>'
          +'<span class="to">'+item.ArrTime.substr(0, 2)+':'+item.ArrTime.substr(2, 2)+'</span>'
        +'</div>'
        +'<div class="address">'
          +'<span class="from">'+item.DepAirportCode+'('+item.DepJetquay+')</span>'
          +'<span class="to">'+item.ArrAirportCode+'('+item.ArrJetquay+')</span>'
        +'</div>';
      var str2 ='';
      var str3 ='';
      var str4 ='';
      var str5 ='';
      var str6 ='';
      var str7 ='';
      var str8 ='';
      var str9 ='';
      // '<div class="price-wra">
      // str2
      // </div>
      // <div class="price-wra">
      // str3
      // </div>
      // <div class="economy-wra">
      // str4
      // <a class="all-classes">
      //   All classes
      //   <i class="icon-all-classes"></i>
      // </a>
      // </div>
      // <div class="flight-tickets"></div>
      // </li>
      item.lstCabin && item.lstCabin.forEach(function(list, index) {
        if (index > 6) {
          str2 += '<span class="price" data-id="'+list.PolicyID+'">CNY'+list.ParPrice+'</span>';
          str4 += '<span class="economy">Economy '+Number(list.Discount)*100+'% Off</span>';
          str6 += '<span class="tickets">'+list.SeatName+'</span>';
          str8 += '<a class="btn" data-id="'+list.PolicyID+'">book</a>';
        } else {
          str3 += '<span class="price" data-id="'+list.PolicyID+'">CNY'+list.ParPrice+'</span>';
          str5 += '<span class="economy">Economy '+Number(list.Discount)*100+'% Off</span>';
          str7 += '<span class="tickets">'+list.SeatName+'</span>';
          str9 += '<a class="btn" data-id="'+list.PolicyID+'">book</a>';
        }
      })
      str1 += '<div class="price-wra">' + str2 + '</div>' + '<div class="economy-wra">' + str4 + '<a class="all-classes">All classes<i class="icon-all-classes"></i></a></div>' + '<div class="flight-tickets">' + str6 + '</div>' + '<div class="seat-btn">' + str8 + '</div></li>';
      // str1 += '<div class="price-wra">' + str2 + '</div>' + '<div class="price-wra">' + str3 + '</div>' + '<div class="economy-wra">' + str4 + '<a class="all-classes">All classes<i class="icon-all-classes"></i></a></div>' + '<div class="flight-tickets">' + str6 + '</div>' + '<div class="seat-btn">' + str8 + '</div></li>';
      str += str1;
    })
    $(".result-content").html(str);
  }

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
