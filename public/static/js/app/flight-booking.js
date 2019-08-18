$(function() {
  // var checkInfo = {
  //   train_date: "2019-09-30",
  //   from_station_name: "beijing",
  //   from_station_code: '{"flightNumber": "PEK", "terminal": "T2111"}',
  //   to_station_name: "shanghai",
  //   to_station_code: '{"flightNumber": "PEK", "terminal": "T4"}',
  //   checi: "321*=*HO1252",
  //   start_time: "06:43",
  //   arrive_time: "12:40",
  //   SettlePrice: 752,
  //   SeatCode: 'w',
  //   SeatName: '经济舱'
  // };
  var checkInfo_ = sessionStorage.getItem('flightCheckData');
  var checkInfo;
  if (checkInfo_) {
    checkInfo = JSON.parse(checkInfo_);
    console.log(checkInfo);
    init();
  }

  // 成年人数改变的时候
  $(".adults-select").on("change", function() {
    var adultsNum = $(this).val();
    numChange(adultsNum);
    priceChange(adultsNum);
  });

  // 提交订单
  $(".sub-book-btn").on("click", function() {
    var passengers = [];
    for (var i = 0; i < $(".traveler-body .item").length; i++) {
      var index = parseInt(i) + 1;
      var sunshuan = $(".traveler-body .item:eq("+i+") .item-sur").val();
      var given = $(".traveler-body .item:eq("+i+") .item-giv").val();
      var type = $(".traveler-body .item:eq("+i+") .item-nat").val();
      var number = $(".traveler-body .item:eq("+i+") .item-pas").val();
      if (!sunshuan) {
        $(".traveler-body .item:eq("+i+") .item-sur").focus();
        return false;
        break;
      }
      if (!given) {
        $(".traveler-body .item:eq("+i+") .item-giv").focus();
        return false;
        break;
      }
      if (!number) {
        $(".traveler-body .item:eq("+i+") .item-pas").focus();
        return false;
        break;
      }
      var passengersename = {
        "sur": sunshuan,
        "giv": given,
        "nat": type
      }
      passengers.push({
        "passengerid": index,
        "passengersename": JSON.stringify(passengersename),
        "piaotype": 1,
        "piaotypename": "成人票",
        "passporttypeseid": 'B',
        "passporttypeseidname": '护照',
        "passportseno": number,
        "price": checkInfo.SettlePrice,
        "zwcode": checkInfo.SeatCode,
        "zwname": checkInfo.SeatName
      })
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
    console.log(terms_condition);
    if (!terms_condition) {
      alert("Please to learn Terms and Conditions for China Flight Tickets Booking Service!");
      return false;
    }
    var data = {
      "type": "af4d1624-03ae-445f-8504-05443dcea729",
      "token": null,
      "train_date": checkInfo.train_date,
      "is_accept_standing": "no",
      "choose_seats": "",
      "from_station_name": checkInfo.from_station_name,
      "from_station_code": checkInfo.from_station_code,
      "to_station_name": checkInfo.to_station_name,
      "to_station_code": checkInfo.to_station_code,
      "checi": checkInfo.checi,
      "passengers": passengers,
      "start_time": checkInfo.start_time,
      "arrive_time": checkInfo.arrive_time,
      "run_time": "",
      "run_time_minute": 0,
      "arrive_days": 0,
      "distance": 0,
      "delivery_method": 1,
      "delivery_address": {},
      "email": email_,
      "phone_number": phone_number_,
    };
    data = Object.assign(data, getSign("post"));
    console.log(data);
    $.ajax({
      url:  APIURL + "/api/order/aircreate",
      data: data,
      dataType: 'json',
      type: 'post',
      success: function(data) {
        console.log(data);
        if (data.code == 1) {
          setCookie('userId', data.data.user_orderid);
          location.href = 'flight-pay.html?id=' + data.data.order_number + '&email=' + data.data.email;
        } else {
          alert("Failure to submit an order")
        }
      }
    })
  });

  // ==========================================================
  function init() {
    var from_station_code = JSON.parse(checkInfo.from_station_code);
    var to_station_code = JSON.parse(checkInfo.to_station_code);
    $(".flight-date").html(checkInfo.train_date);
    $(".txt-flight-name").html(checkInfo.checi.split("*=*")[1]);
    $(".flight-aircraft").html("Aircraft: "+checkInfo.checi.split("*=*")[0]);
    $(".flight-from-time").html(checkInfo.start_time);
    $(".flight-to-time").html(checkInfo.arrive_time);
    $(".flight-from-adress").html(from_station_code.flightNumber+"("+from_station_code.terminal+")");
    $(".flight-to-adress").html(to_station_code.flightNumber+"("+to_station_code.terminal+")");
    $(".time-seating .seating").html(checkInfo.SeatName);
    $(".ad-rmb").html(checkInfo.SettlePrice);
    priceChange(1);
  }

  function numChange(num_) {
    var num = Number(num_);
    var length = $(".traveler-body .item").length;
    if (length > num) {
      var diff = length - num;
      for (var i = diff; i > 0; i--) {
        $(".traveler-body .item").eq(num+i-1).remove();
      }
    } else if (length < num) {
      var diff = num - length;
      var str = "";
      for (var i = 0; i < diff; i++) {
        str += `<li class="item">
          <span class="type">Adult${length+i+1}.</span>
          <input class="item-sur" type="text" placeholder="HODSON">
          <input class="item-giv" type="text" placeholder="LARRY LESTER">
          <input class="item-nat" type="text" placeholder="UNITED STATES OF AMERICA">
          <input class="item-pas" type="text" placeholder="561261226">
          <input class="item-bir" type="text" placeholder="01/25/2017">
        </li>`;
      }
      $(".traveler-body").append(str);
    }
  }

  function priceChange(num_) {
    var price = checkInfo.SettlePrice;
    var total = parseInt(price * num_);
    var totalUsd = parseInt(total / ExchangeRate);
    $(".grand-total-price").html("CNY"+total+"(US$"+totalUsd+")");
  }
})
