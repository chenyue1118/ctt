$(function(){
  var orderInfo = sessionStorage.getItem("orderInfo");
  if (orderInfo) orderInfo = JSON.parse(orderInfo);
  var train_station = [];
  var train_station_py = [];
  var service_Fee = orderInfo[0].ServiceFee;      // 服务费
  var delivery_method = 1;  // 票送方式
  var timeBeyond = false;

  getStation();
  computingTime();
  init();

  // 成年人数改变的时候
  $(".adults-select").on("change", function() {
    var adultsNum = $(this).val();
    var childrenNum = $(".children-select").val();
    numChange(adultsNum, childrenNum);
    priceChange(adultsNum, childrenNum)
  });
  // 未成年人数改变的时候
  $(".children-select").on("change", function() {
    var childrenNum = $(this).val();
    var adultsNum = $(".adults-select").val();
    numChange(adultsNum, childrenNum);
    priceChange(adultsNum, childrenNum)
  });

  // 票送方式选择
  $(".collection-types .item .head .icon-coll").on("click", function() {
    if (!timeBeyond) return false;
    $(".collection-types .item .head").removeClass("active");
    $(this).parents(".head").addClass("active");
    delivery_method = $(this).attr("data-type");
  });

  // 居住酒店日期
  $(".deliver-date-wra .deliver-date").datepicker({
    numberOfMonths: 2,
    showButtonPanel: false,
    dateFormat: 'dd.MM.yy',
    showAnim: 'slideDown',
    minDate: +0
  });

  // 提交订单
  $(".sub-book-btn").on("click", function() {
    // adult-info
    // 获取乘客信息
    var passengers = [];
    for (var i = 0; i < $(".adult-info .item-adult").length; i++) {
      var index = parseInt(i) + 1;
      var sunshuan = $(".adult-info .item-adult:eq("+i+") .sur").val();
      var given = $(".adult-info .item-adult:eq("+i+") .name").val();
      var type = $(".adult-info .item-adult:eq("+i+") .type").val();
      var number = $(".adult-info .item-adult:eq("+i+") .number").val();
      if (!sunshuan) {
        $(".adult-info .item-adult:eq("+i+") .sur").focus();
        return false;
        break;
      }
      if (!given) {
        $(".adult-info .item-adult:eq("+i+") .name").focus();
        return false;
        break;
      }
      if (!number) {
        $(".adult-info .item-adult:eq("+i+") .number").focus();
        return false;
        break;
      }
      passengers.push({
        "passengerid": index,
        "passengersename": sunshuan + "" + given,
        "piaotype": 1,
        "piaotypename": "成人票",
        "passporttypeseid": type,
        "passporttypeseidname": getCertEn(type),
        "passportseno": number,
        "price": orderInfo[0].train_price,
        "zwcode": orderInfo[0].train_zwcode,
        "zwname": getSeatName(orderInfo[0].train_zwcode)
      })
    }
    // 获取儿童票
    for (var i = 0; i < $(".child-info .item-child").length; i++) {
      var index = parseInt(passengers.length) + parseInt(i) + 1;
      var sunshuan = $(".child-info .item-child:eq("+i+") .sur").val();
      var given = $(".child-info .item-child:eq("+i+") .name").val();
      var type = $(".child-info .item-child:eq("+i+") .type").val();
      var number = $(".child-info .item-child:eq("+i+") .number").val();
      if (!sunshuan) {
        $(".child-info .item-child:eq("+i+") .sur").focus();
        return false;
        break;
      }
      if (!given) {
        $(".child-info .item-child:eq("+i+") .name").focus();
        return false;
        break;
      }
      if (!number) {
        $(".child-info .item-child:eq("+i+") .number").focus();
        return false;
        break;
      }
      passengers.push({
        "passengerid": index,
        "passengersename": sunshuan + "" + given,
        "piaotype": 2,
        "piaotypename": "儿童票",
        "passporttypeseid": type,
        "passporttypeseidname": getCertEn(type),
        "passportseno": number,
        "price": Number(orderInfo[0].train_price / 2),
        "zwcode": orderInfo[0].train_zwcode,
        "zwname": getSeatName(orderInfo[0].train_zwcode)
      })
    }
    // 获取票送方式 和地址
    var delivery_address = {};
    if (delivery_method == 2) {
      var HotelName = $(".HotelName").val();
      var HotelAddress = $(".HotelAddress").val();
      var HotelPhone = $(".HotelPhone").val();
      var BookName = $(".BookName").val();
      var CheckInDate = $(".CheckInDate").val();
      var CheckOutDate = $(".CheckOutDate").val();
      if (!HotelName) {
        $(".HotelName").focus();
        return false;
      }
      if (!HotelAddress) {
        $(".HotelAddress").focus();
        return false;
      }
      if (!HotelPhone) {
        $(".HotelPhone").focus();
        return false;
      }
      if (!BookName) {
        $(".BookName").focus();
        return false;
      }
      if (!CheckInDate) {
        $(".CheckInDate").focus();
        return false;
      }
      if (!CheckOutDate) {
        $(".CheckOutDate").focus();
        return false;
      }
      delivery_address.HotelName = HotelName;
      delivery_address.HotelAddress = HotelAddress;
      delivery_address.HotelPhone = HotelPhone;
      delivery_address.BookName = BookName;
      delivery_address.CheckInDate = CheckInDate;
      delivery_address.CheckOutDate = CheckOutDate;
    } else if (delivery_method == 3) {
      var HomeAddress = $(".HomeAddress").val();
      var ReceiverName = $(".ReceiverName").val();
      var ReceiverPhone = $(".ReceiverPhone").val();
      if (!HomeAddress) {
        $(".HomeAddress").focus();
        return false;
      }
      if (!ReceiverName) {
        $(".ReceiverName").focus();
        return false;
      }
      if (!ReceiverPhone) {
        $(".ReceiverPhone").focus();
        return false;
      }
      delivery_address.HomeAddress = HomeAddress;
      delivery_address.ReceiverName = ReceiverName;
      delivery_address.ReceiverPhone = ReceiverPhone;
    }
    var email_ = $(".book-email").val();
    var name_ = $(".book-name").val();
    var phone_number_ = $(".book-phone").val();
    if (!name_) {
      $(".book-name").focus();
      return false;
    }
    if (!email_) {
      $(".book-email").focus();
      return false;
    }
    if (!phone_number_) {
      $(".book-phone").focus();
      return false;
    }
    var terms_condition = $(".book-terms-condition").prop("checked");
    if (!terms_condition) {
      alert("Please to learn Terms and Conditions for China Train Tickets Booking Service!");
      return false;
    }
    var data_ = {
      "token": null,
      "train_date": orderInfo[0].train_time.substr(0,4)+"-"+orderInfo[0].train_time.substr(4,2)+"-"+orderInfo[0].train_time.substr(6,2),
      "is_accept_standing": "no",
      "choose_seats": "",
      "from_station_name": codeGetPy(orderInfo[0].train_from),
      "from_station_code": orderInfo[0].train_from,
      "to_station_name": codeGetPy(orderInfo[0].train_to),
      "to_station_code": orderInfo[0].train_to,
      "checi": orderInfo[0].train_code,
      "passengers": passengers,
      "start_time":  orderInfo[0].start_time,
      "arrive_time": orderInfo[0].arrive_time,
      "run_time": orderInfo[0].run_time,
      "run_time_minute": orderInfo[0].run_time_minute,
      "arrive_days": orderInfo[0].arrive_days,
      "distance": orderInfo[0].distance,
      "delivery_method": delivery_method,
      "delivery_address": delivery_address,
      "email": email_,
      "phone_number": phone_number_
    }
    data_ = Object.assign(data_, getSign("post"))
    $.ajax({
      url:  APIURL + "/api/order/create",
      data: data_,
      dataType: 'json',
      type: 'post',
      success: function(data) {
        if (data.code == 1) {
          setCookie('userId', data.data.user_orderid);
          location.href = 'train-pay.html?id=' + data.data.order_number + '&email=' + data.data.email;
        } else {
          alert("Failure to submit an order")
        }
      }
    })
  })

  // 跳转首页
  $(".booking_ .nav .home").on("click", function() {
    location.href = "/";
  });
  $(".booking_ .nav .search").on("click", function() {
    location.href = "train-search.html";
  });
  // ===========================================================
  // TODO:发送数据
  // Test()
  function Test() {
    var data = {
      "token": null,
      "train_date": "2019-06-18",
      "is_accept_standing": "no",
      "choose_seats": "",
      "from_station_name": codeGetPy("VNP"),
      "from_station_code": "VNP",
      "to_station_name": codeGetPy("AOH"),
      "to_station_code": "AOH",
      "checi": "G101",
      "passengers": [
        {
          "passengerid": 1,
          "passengersename": "CHENXIAO",
          "piaotype": 1,
          "piaotypename": "成人票",
          "passporttypeseid": "B",
          "passporttypeseidname": "护照",
          "passportseno": "12345678",
          "price": 120,
          "zwcode": "O",
          "zwname": "二等座"
        }
      ],
      "start_time": "06:43",
      "arrive_time": "12:40",
      "run_time": "05:57",
      "run_time_minute": 357,
      "arrive_days": 0,
      "distance": 120,
      "delivery_method": 2,
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
      url:  APIURL + "/api/order/create",
      data: data,
      dataType: 'json',
      type: 'post',
      success: function(data) {
        console.log(data);
      }
    })
  }

  // TODO: 查询订单
  // Search()
  function Search() {
    $.ajax({
      url: APIURL + "/api/order/queryV2?order_number="+"CTT20190620011807591"+"&email="+"1023581658@qq.com"+"&phone_number=" +"123456"+ getSign("get"),
      dataType: "json",
      type: "get",
      success: function(data) {
        console.log(data);
      }
    })
  }

  // 初始化数据
  function init() {
    // +'<li class="item">Children: CNY933/US$141 X <span class="num">0</span></li>'
    if (!orderInfo) return false;
    var str = "";
    var grandTotal = 0;
    orderInfo.forEach(function(item, index) {
      grandTotal += Number(priceExchangeRate(Number(item.train_price) + Number(item.ServiceFee), ExchangeRate));
      var index = index + 1;
      str += '<li class="trip">'
                +'<div class="head">'
                  +'<div class="left">'
                    +'<span class="index">Trip '+index+'</span>'
                    +'<span class="date">'+timeFormat(item.train_time)+'</span>'
                  +'</div>'
                  +'<div class="right">'
                    +'<div class="doubt">'
                      +'<div class="doubt-wrapper">'
                        +'<div class="doubt-wra">'
                          +'<h4 class="tit">We offer:</h4>'
                          +'<p class="con">1. One-to-one 24/7 English Expert Service.</p>'
                          +'<p class="con">2. Experienced pre-booking consultation and efficient after-sale support.</p>'
                        +'</div>'
                      +'</div>'
                    +'</div>'
                    +'<i class="del"></i>'
                  +'</div>'
                +'</div>'
                +'<div class="ticket">'
                  +'<span class="number">'+item.train_code+'</span>'
                  +'<div class="info">'
                    +'<div class="lines">'
                      +'<span class="from"></span>'
                      +'<span class="line"></span>'
                      +'<span class="to"></span>'
                    +'</div>'
                    +'<div class="time">'
                      +'<span class="from">'+item.start_time+'</span>'
                      +'<span class="to">'+item.arrive_time+'</span>'
                    +'</div>'
                    +'<div class="address">'
                      +'<span class="from">'+codeGetPy(item.train_from)+'</span>'
                      +'<span class="to">'+codeGetPy(item.train_to)+'</span>'
                    +'</div>'
                  +'</div>'
                  +'<div class="time-seating">'
                    +'<span class="time">'+getDuration(item.train_duration)+'</span> | <span class="seating">'+getSeat(item.train_zwcode)+'</span>'
                  +'</div>'
                  +'<div class="ticket-price">'
                    +'<ul class="price-info">'
                      +'<li class="item">Adult: US$'+priceExchangeRate(item.train_price, ExchangeRate)+' X <span class="num">1</span></li>'
                      +'<li class="item">Service Fee: US$'+ priceExchangeRate(service_Fee, ExchangeRate)+' X <span class="num">1</span></li>'
                    +'</ul>'
                    +'<div class="total">'
                      // +'Total: US$'+ (Number(item.train_price) + service_Fee)
                      +'Total: US$'+ priceExchangeRate(Number(item.train_price) + Number(service_Fee), ExchangeRate)
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</li>'
    })
    $(".mytrip .trips .trip").remove();
    $(".mytrip .trips").prepend(str);
    $(".price .detail").html("US$" + grandTotal);
  }

  // 计算时间 小于72个小时不能选择快递
  function computingTime() {
    if (!orderInfo) return false;
    var ymsTime = orderInfo[0].train_time.substr(0, 4) + '/' + orderInfo[0].train_time.substr(4, 2) + '/' + orderInfo[0].train_time.substr(6, 2) +' ' + orderInfo[0].start_time;
    var startTime = new Date(ymsTime).getTime();
    var newTime = new Date().getTime();
    if ((startTime - newTime) > 72*60*60*1000) {
      timeBeyond = true;
    } else {
      $(".collection-types .coll-hotel").addClass("method-disable");
      $(".collection-types .coll-address").addClass("method-disable");
    }
  }

  // 当人数发生改变时候
  function numChange(num1, num2) {
    if (!orderInfo) return false;
    // 成人/未成年人  删除 / 添加
    var itemadult = $(".adult-info .item-adult").length;
    var itemchild = $(".child-info .item-child").length;
    if (num1 > itemadult) {
      var diff1 = num1 - itemadult;
      var str1 = "";
      for (var i = 0; i < diff1; i++) {
        var index1 = itemadult + i + 1;
        str1 += '<li class="item item-adult">'
                  +'<span class="adu">Adults'+index1+'.</span>'
                  +'<input class="sur" type="text">'
                  +'<input class="name" type="text">'
                  +'<select class="type">'
                    +'<option value="1">Chinese ID Card</option>'
                    +'<option value="C">Mainland Travel Permit for HK/Macau Residents</option>'
                    +'<option value="B" selected>Passport</option>'
                    +'<option value="G">Mainland Travel Permit for Taiwan Residents</option>'
                  +'</select>'
                  +'<input class="number" type="text" name="" value="">'
                +'</li>'
      }
      $(".adult-info").append(str1);
    } else if (num1 < itemadult) {
      var diff1 = itemadult - num1;
      for (var i = diff1; i > 0; i--) {
        var index1 = Number(num1) + i - 1;
        $(".adult-info .item-adult:eq("+index1+")").remove();
      }
    }
    // 未成年人
    if (num2 > itemchild) {
      var diff2 = num2 - itemchild;
      var str2 = "";
      for (var i = 0; i < diff2; i++) {
        var index2 = itemchild + i + 1;
        str2 += '<li class="item item-child">'
                  +'<span class="adu">Child.'+index2+'.</span>'
                  +'<input class="sur" type="text">'
                  +'<input class="name" type="text">'
                  +'<select class="type">'
                    +'<option value="1">Chinese ID Card</option>'
                    +'<option value="C">Mainland Travel Permit for HK/Macau Residents</option>'
                    +'<option value="B" selected>Passport</option>'
                    +'<option value="G">Mainland Travel Permit for Taiwan Residents</option>'
                  +'</select>'
                  +'<input class="number" type="text" name="" value="">'
                +'</li>'
      }
      $(".child-info").append(str2);
    } else if (num2 < itemchild) {
      var diff2 = itemchild - num2;
      for (var i = diff2; i > 0; i--) {
        var index2 = Number(num2) + i - 1;
        $(".child-info .item-child:eq("+index2+")").remove();
      }
    }
  }

  // 价格计算
  function priceChange(adultsNum, childrenNum) {
    if (!orderInfo) return false;
    var grandPrice = 0;
    orderInfo.forEach(function (item, index) {
      if (childrenNum > 0) {
        var adandch = Number(adultsNum)+Number(childrenNum)
        var str = '<li class="item">Adult: US$'+priceExchangeRate(item.train_price, ExchangeRate)+' X <span class="num">'+adultsNum+'</span></li>'
                  +'<li class="item">Children: US$'+ priceExchangeRate(Number(item.train_price)/2, ExchangeRate)+' X <span class="num">'+childrenNum+'</span></li>'
                  +'<li class="item">Service Fee: US$'+ priceExchangeRate(service_Fee, ExchangeRate)+' X <span class="num">'+adandch+'</span></li>';
        $(".trips .trip:eq("+index+") .price-info").html(str);
      } else {
        var str = '<li class="item">Adult: US$'+priceExchangeRate(Number(item.train_price), ExchangeRate)+' X <span class="num">'+adultsNum+'</span></li>'
                  +'<li class="item">Service Fee: US$'+priceExchangeRate(service_Fee, ExchangeRate)+' X <span class="num">'+Number(adultsNum)+'</span></li>';
        $(".trips .trip:eq("+index+") .price-info").html(str);
      }
      var totalPrice = priceExchangeRate(Number(item.train_price), ExchangeRate) * Number(adultsNum) +  priceExchangeRate(Number(item.train_price) / 2, ExchangeRate) * Number(childrenNum) + (Number(adultsNum) + Number(childrenNum)) * priceExchangeRate(service_Fee, ExchangeRate);
      grandPrice += totalPrice;
      $(".trips .trip:eq("+index+") .total").html("Total: US$" + totalPrice);
    })
    $(".price .detail").html("US$" + grandPrice)
  }

  //获取所有的车站信息
  function getStation(){
    // 车站数据
    var station_name_arr = station_names.split("|");
    for(var i=0;i< parseInt((station_name_arr.length-1) / 5);i++){
      train_station.push({
        "name": station_name_arr[i*5+1],
        "code": station_name_arr[i*5+2],
        "pinyin": station_name_arr[i*5+3]
      });
      // train_station_py.push(station_name_arr[i*5+3]);
      train_station_py.push({
        label: firstCap(station_name_arr[i*5+3]) + " ("+station_name_arr[i*5+1]+")",
        value: firstCap(station_name_arr[i*5+3]) + " ("+station_name_arr[i*5+1]+")"
      });
    }
  }

  // 时间格式化
  function timeFormat(time) {
    return time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8);
  }

  // 根据该城市的code查询拼音
  function codeGetPy(code, en){
    var en = en || "";
    // train_station
    var code = code || "";
    var cityPy = "";
    train_station.forEach(function(item){
      if(item.code == code){
        if(en){
          cityPy = firstCap(item.pinyin)+"("+item.name+")";
        }else{
          cityPy = firstCap(item.pinyin);
        }
      }
    });
    return cityPy;
  }

  // 耗时转换
  function getDuration(str) {
    var data = str.split(":");
    return data[0] + "h" + data[1] + "m";
  }

  // // 获取座位
  // function getSeat (type) {
  //   var seat = "";
  //   switch (type) {
  //     case "O":
  //       seat = "2nd Cls."
  //       break;
  //     case "M":
  //       seat = "1nd Cls."
  //       break;
  //     case "9":
  //       seat = "Business Cls"
  //       break;
  //     case "F":
  //       seat = "CRH Berth"
  //       break;
  //     case "4":
  //       seat = "Soft Sleeper"
  //       break;
  //     case "3":
  //       seat = "Hard Sleeper"
  //       break;
  //     case "1":
  //       seat = "Soft Seat"
  //       break;
  //   }
  //   return seat;
  // }

  // code 获取证件类型
  function getCertEn(code) {
    var str;
    if(code == "1"){
      str = "二代身份证";
    }else if(code == "C"){
      str = "港澳通行证";
    }else if(code == "B"){
      str = "护照";
    }else if(code == "G"){
      str = "台湾通行证";
    }
    return str;
  }

  //根据座位简码获取座位名称 M --> 一等座
  function getSeatName(code){
    var str = "";
    var code = ""+code;
    switch (code) {
      case "F":
        str = "动卧";
        break;
      case "9":
        str = "商务座";
        break;
      case "P":
        str = "特等座";
        break;
      case "M":
        str = "一等座";
        break;
      case "O":
        str = "二等座";
        break;
      case "4":
        str = "软卧";
        break;
      case "3":
        str = "硬卧";
        break;
      case "2":
        str = "软座";
        break;
      case "1":
        str = "硬座";
        break;
    }
    return str;
  }

});
