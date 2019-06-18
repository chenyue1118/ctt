$(function(){
  var orderInfo = sessionStorage.getItem("orderInfo");
  if (orderInfo) orderInfo = JSON.parse(orderInfo);
  var train_station = [];
  var train_station_py = [];
  var serviceFee = 10;    // 服务费

  getStation();
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
      "delivery_method": 1,
      "delivery_address": "BEIJING",
      "email": "1023581658@qq.com",
      "phone_number": "15600121178",
    }
    data = Object.assign(data, getSign("post"))
    console.log(data);
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
  Search()
  function Search() {
    $.ajax({
      url: APIURL + "/api/order/queryV2?order_number="+"CTT20190619002941853"+"&email="+"1023581658@qq.com"+"&phone_number=" +"15600121178"+ getSign("get"),
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
      grandTotal += Number(item.train_price) + serviceFee;
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
                      +'<li class="item">Adult: US$'+item.train_price+' X <span class="num">1</span></li>'
                      +'<li class="item">Service Fee: US$'+serviceFee+' X <span class="num">1</span></li>'
                    +'</ul>'
                    +'<div class="total">'
                      +'Total: US$'+ (Number(item.train_price) + serviceFee)
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</li>'
    })
    $(".mytrip .trips .trip").remove();
    $(".mytrip .trips").prepend(str);
    $(".price .detail").html("US$" + grandTotal);
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
        console.log(index1);
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
    console.log(orderInfo);
    var grandPrice = 0;
    orderInfo.forEach(function (item, index) {
      if (childrenNum > 0) {
        var adandch = Number(adultsNum)+Number(childrenNum)
        var str = '<li class="item">Adult: US$'+item.train_price+' X <span class="num">'+adultsNum+'</span></li>'
                  +'<li class="item">Children: US$'+Number(item.train_price)/2+' X <span class="num">'+childrenNum+'</span></li>'
                  +'<li class="item">Service Fee: US$'+serviceFee+' X <span class="num">'+adandch+'</span></li>';
        $(".trips .trip:eq("+index+") .price-info").html(str);
      } else {
        var str = '<li class="item">Adult: US$'+item.train_price+' X <span class="num">'+adultsNum+'</span></li>'
                  +'<li class="item">Service Fee: US$'+serviceFee+' X <span class="num">'+Number(adultsNum)+'</span></li>';
        $(".trips .trip:eq("+index+") .price-info").html(str);
      }
      var totalPrice = Number(item.train_price) * Number(adultsNum) + Number(item.train_price) / 2 * Number(childrenNum) + (Number(adultsNum) + Number(childrenNum)) * serviceFee;
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

});
