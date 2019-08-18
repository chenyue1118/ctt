$(function() {
  var flightCityCodeSelect = [];
  var flight_from = GetQueryString("from");
  var flight_from_code = GetQueryString("from_code");
  var flight_to = GetQueryString("to");
  var flight_to_code = GetQueryString("to_code");
  var flight_date = GetQueryString("date");
  var checkData = {};

  init();

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
    $("#trip-time").val(time_);
    flightSearch();
  });

  $(".trip-search").on("click", function() {
    flightSearch();
  })

  $(".result-content").on("click", ".flight-submit-btn", function() {
    console.log($(this).attr("data-id"));
    console.log(checkData[$(this).attr("data-id")]);
    try {
      var flightCheckData = checkData[$(this).attr("data-id")];
      sessionStorage.setItem('flightCheckData', JSON.stringify(flightCheckData));
    } catch (e) {
      console.log(e);
    }
    location.href = "flight-booking.html";
  })

  $(".result-content").on("click", ".all-classes", function() {
    $(this).hide();
    $(this).parents(".item").find(".price-wra .price").show();
    $(this).parents(".item").find(".economy-wra .economy").show();
    $(this).parents(".item").find(".flight-tickets .tickets").show();
    $(this).parents(".item").find(".seat-btn .btn").show();
  })
  // ==========================================================
  function init() {
    // 日期初始化
    $("#trip-time").datepicker({
      numberOfMonths: 2,
      showButtonPanel: false,
      dateFormat: 'yy-mm-dd',
      showAnim: 'slideDown',
      minDate: +0
    });
    flightCityCode && flightCityCode.forEach(function(item) {
      flightCityCodeSelect.push({
        lable: item[1],
        value: item[1]
      })
    })
    // 起点初始化
    $("#trip-from").autocomplete({
      source: flightCityCodeSelect,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#trip-from"));
      }
    });
    // 终点初始化
    $("#trip-to").autocomplete({
      source: flightCityCodeSelect,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#trip-to"));
      }
    });

    if (flight_from && flight_from_code) {
      $("#trip-from").val(flight_from);
      $("#trip-from").attr("data-code", flight_from_code);
    }
    if (flight_to && flight_to_code) {
      $("#trip-to").val(flight_to);
      $("#trip-to").attr("data-code", flight_to_code);
    }
    if (flight_date) {
      $("#trip-time").val(flight_date);
      showTimeList(flight_date)
    }
    flightSearch();
  }

  function flightSearch() {
    var flight_from = $("#trip-from").val();
    var flight_from_code = $("#trip-from").attr("data-code");
    var flight_to = $("#trip-to").val();
    var flight_to_code = $("#trip-to").attr("data-code");
    var flight_date = $("#trip-time").val();
    if (!flight_from_code) {
       $("#trip-from").focus();
       return false;
    }
    if (!flight_to_code) {
       $("#trip-to").focus();
       return false;
    }
    if (!flight_date) {
       $("#trip-time").focus();
       return false;
    }
    $(".loading").show();
    flightSearchList(flight_from_code, flight_to_code, flight_date);
  }


  // Test()
  function Test() {
    var data = {
      "type": "af4d1624-03ae-445f-8504-05443dcea729",
      "token": null,
      "train_date": "2019-09-30",
      "is_accept_standing": "no",
      "choose_seats": "",
      "from_station_name": '{"flightNumber": "PEK", "terminal": "T2111"}',
      "from_station_code": "PEK",
      "to_station_name": "上海",
      "to_station_code": '{"flightNumber": "PEK", "terminal": "T4"}',
      "checi": "321*=*HO1252",
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
      "run_time": "",
      "run_time_minute": 0,
      "arrive_days": 0,
      "distance": 0,
      "delivery_method": 1,
      "delivery_address": {
        "HotelName": "",
        "HotelAddress": "",
        "HotelPhone": "",
        "BookName": "",
        "CheckInDate": "",
        "CheckOutDate": "",
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
        // alert(111)
        if (data.code == 1) {
          // setCookie('userId', data.data.user_orderid);
          // location.href = 'flight-pay.html?id=' + data.data.order_number + '&email=' + data.data.email;
        } else {
          alert("Failure to submit an order")
        }
      }
    })
  }

  // TODO: 查询订单
  // Search()
  function Search() {
    $.ajax({
      url: APIURL + "/api/order/queryV2?order_number="+"CTT20190818170701496"+"&email="+"1023581658@qq.com"+"&phone_number=" +"15600121178"+ getSign("get"),
      dataType: "json",
      type: "get",
      success: function(data) {
        console.log(data);
      }
    })
  }

  // flightSearch('PEK', 'SHA', '2019-08-30')
  // 飞机票搜索
  function flightSearchList(from, to, time) {
    var url_ = APIURL + '/api/ticket/queryFlights?StartAirportCode=' + from + '&EndAirportCode=' + to + '&StartDate=' + time + '&StartTime=0000&SeatClass=ALL&AirlineCode=ALL'
    $.ajax({
      url: url_,
      dataType: "json",
      type: "get",
      success: function(data) {
        $(".loading").hide();
        if (data.code == 1) {
          if (data.data.length > 0) {
            $(".search-noresult-wrapper").hide();
            showFlight(data.data);
            $(".detail-address-from").html($("#trip-from").val());
            $(".detail-address-to").html($("#trip-to").val());
            $(".detail-address-num").html(data.data.length);
          }
        }
      }
    });
  }

  // 显示飞机票列表
  function showFlight(data) {
    var checkInfoFlight = {
      "train_date": $("#trip-time").val(),
      "from_station_name": $("#trip-from").val(),
      "from_station_code": '',
      "to_station_name": $("#trip-to").val(),
      "to_station_code": '',
      "checi": "",
      "start_time": "",
      "arrive_time": "",
      "SettlePrice": "",
      "SeatCode": '',
      "SeatName": ''
    };
    var str = '';
    data && data.forEach(function(item) {
      if (item.lstCabin && item.lstCabin.length > 0) {
        checkInfoFlight.checi = item.PlantType + '*=*' + item.FlightNo;
        checkInfoFlight.start_time = item.DepTime.substr(0, 2) + ":" + item.DepTime.substr(2, 2);
        checkInfoFlight.arrive_time = item.ArrTime.substr(0, 2) + ":" + item.ArrTime.substr(2, 2);
        var from_station_code_ = {
          "flightNumber": item.DepAirportCode,
          "terminal": item.DepJetquay
        };
        var to_station_code_ = {
          "flightNumber": item.ArrAirportCode,
          "terminal": item.ArrJetquay
        };
        checkInfoFlight.from_station_code = JSON.stringify(from_station_code_);
        checkInfoFlight.to_station_code = JSON.stringify(to_station_code_);
        var str1 = '<li class="item">'
          +'<div class="flight-info">'
            +'<div class="info-name">'
              +'<i class="icon-flight-name"></i>'
              +'<span class="txt-flight-name">'+item.FlightNo+'</span>'
            +'</div>'
            +'<div class="flight-aircraft">'
              +'Aircraft:'+item.PlantType
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
        item.lstCabin && item.lstCabin.forEach(function(list, index) {
          var checkDataState = list.PolicyID + list.SeatCode + list.SettlePrice
          checkInfoFlight.SettlePrice = list.SettlePrice;
          checkInfoFlight.SeatCode = list.SeatCode;
          checkInfoFlight.SeatName = list.SeatName;
          if (index < 4) {
            str2 += '<span class="price" data-id="'+list.PolicyID+'">CNY'+list.ParPrice+'</span>';
            str3 += '<span class="economy">Economy '+parseInt(Number(list.Discount)*100)+'% Off</span>';
            str4 += '<span class="tickets">'+list.SeatName+'</span>';
            str5 += '<a class="btn flight-submit-btn" data-id="'+checkDataState+'">book</a>';
          } else {
            str2 += '<span style="display:none;" class="price" data-id="'+list.PolicyID+'">CNY'+list.ParPrice+'</span>';
            str3 += '<span style="display:none;" class="economy">Economy '+parseInt(Number(list.Discount)*100)+'% Off</span>';
            str4 += '<span style="display:none;" class="tickets">'+list.SeatName+'</span>';
            str5 += '<a style="display:none;" class="btn flight-submit-btn" data-id="'+checkDataState+'">book</a>';
          }
          checkData[checkDataState] = checkInfoFlight;
        })
        str1 += `<div class="price-wra">${str2}</div><div class="economy-wra">${str3}<a class="all-classes">All classes<i class="icon-all-classes"></i></a></div><div class="flight-tickets">${str4}</div><div class="seat-btn">${str5}</div></li>`;
        // str1 += '<div class="price-wra">' + str2 + '</div>' + '<div class="economy-wra">' + str4 + '<a class="all-classes">All classes<i class="icon-all-classes"></i></a></div>' + '<div class="flight-tickets">' + str6 + '</div>' + '<div class="seat-btn">' + str8 + '</div></li>';
        str += str1;
      }
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

  // 根据城市信息来设置对应的CODE   Beijing(北京) --> BJP
  function setTrainCode(value, dom){
    flightCityCode && flightCityCode.forEach(function(item) {
      if (item[1] == value) dom.attr("data-code", item[0]);
    })
  }

});
