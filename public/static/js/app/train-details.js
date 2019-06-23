$(function() {
  var serviceFee = 10;      // 服务费
  var checkInfo = sessionStorage.getItem("checkInfo");
  console.log(JSON.parse(checkInfo));
  if (checkInfo) init();

  // 跳转首页
  $(".order-details_ .nav .home").on("click", function() {
    location.href = "/";
  });
  $(".order-details_ .nav .search").on("click", function() {
    location.href = "train-search.html";
  });
  // ==================================================

  function init() {
    var checkInfo_ = JSON.parse(checkInfo);
    $(".order-number").html("Tarching No.: "+checkInfo_.order_number);
    $(".order-submit-time").html("Tarching No.: "+checkInfo_.order_number);
    $(".trip-info .head .left .date").html(checkInfo_.train_date);
    // TODO: status
    $(".trip-info .ticket .number").html(checkInfo_.checi);
    $(".trip-info .ticket .info .time .from").html(checkInfo_.start_time);
    $(".trip-info .ticket .info .time .to").html(checkInfo_.arrive_time);
    $(".trip-info .ticket .info .address .from").html(checkInfo_.from_station_name);
    $(".trip-info .ticket .info .address .to").html(checkInfo_.to_station_name);
    var durTime = computingTime(checkInfo_.train_date + " " + checkInfo_.start_time, checkInfo_.train_date + " " + checkInfo_.arrive_time, checkInfo_.arrive_days);
    $(".trip-info .ticket .time-seating .time").html(durTime);
    $(".trip-info .ticket .time-seating .seating").html(getSeat(checkInfo_.passengers[0].zwcode));
    $(".trip-info .ticket .time-seating .num").html(' x ' + checkInfo_.passengers.length);
    var str = "";
    var str_ad = 0;
    var str_ch = 0;
    var str_ad_pr = 0;
    var str_ch_pr = 0;
    var str_ad_pass = '';
    var str_ch_pass = '';
    checkInfo_.passengers.forEach(function(item) {
      if (item.piaotype == 1) {
        str_ad ++;
        str_ad_pr = item.priceUSD;
        str_ad_pass += '<li class="item">'
                        +'<span class="con sex">Adult '+str_ad+'.</span>'
                        +'<span class="con station">'+item.passengersename+'</span>'
                        +'<span class="con number">Passport No.: '+item.passportseno+'</span>'
                      +'</li>';
      } else if (item.piaotype == 2) {
        str_ch ++;
        str_ch_pr = item.priceUSD;
        str_ch_pass += '<li class="item">'
                        +'<span class="con sex">Child '+str_ch+'.</span>'
                        +'<span class="con station">'+item.passengersename+'</span>'
                        +'<span class="con number">Passport No.: '+item.passportseno+'</span>'
                      +'</li>';
      }
    })
    if (str_ch > 0) {
      str += '<li class="item">Adult: US$'+str_ad_pr+' X <span class="num">'+str_ad+'</span></li>';
      str += '<li class="item">Child: US$'+str_ch_pr+' X <span class="num">'+str_ch+'</span></li>';
    } else {
      str += '<li class="item">Adult: US$'+str_ad_pr+' X <span class="num">'+str_ad+'</span></li>';
    }
    str += '<li class="item">Service Fee: US$'+serviceFee+' X <span class="num">'+checkInfo_.passengers.length+'</span></li>';
    $(".trip-info .ticket .ticket-price .price-info").html(str);
    // TODO: 价格计算
    // $(".trip-info .ticket .ticket-price .total").html(0);
    $(".grand-total .num").html("USD" + checkInfo_.orderamountUSD);
    $(".detail-traveler .traveler-wra").append(str_ad_pass);
    $(".detail-traveler .traveler-wra").append(str_ch_pass);
    // TODO: 订票人信息
    $(".detail-contact .contact-wra .name").html(checkInfo_.name);
    $(".detail-contact .contact-wra .nationality").html(checkInfo_.nationality);
    $(".detail-contact .contact-wra .email").html(checkInfo_.email);
    $(".detail-contact .contact-wra .phone").html(checkInfo_.phone_number);
    if (checkInfo_.delivery_method == 1) {
      $(".express-contact").hide();
    } else if (checkInfo_.delivery_method == 2 && checkInfo_.delivery_address) {
      $(".express-contact .express-wra1").show();
      $(".express-contact .express-wra2").hide();
      $(".express-contact .val01").html(checkInfo_.delivery_address.HotelName);
      $(".express-contact .val02").html(checkInfo_.delivery_address.HotelAddress);
      $(".express-contact .val03").html(checkInfo_.delivery_address.HotelPhone);
      $(".express-contact .val04").html('');
      $(".express-contact .val05").html(checkInfo_.delivery_address.BookName);
      $(".express-contact .val06").html(checkInfo_.delivery_address.CheckInDate);
      $(".express-contact .val07").html(checkInfo_.delivery_address.CheckOutDate);
    } else if (checkInfo_.delivery_method == 3 && checkInfo_.delivery_address) {
      $(".express-contact .express-wra2").show();
      $(".express-contact .express-wra1").hide();
      $(".express-contact .val01").html(checkInfo_.delivery_address.HomeAddress);
      $(".express-contact .val02").html(checkInfo_.delivery_address.ReceiverName);
      $(".express-contact .val03").html(checkInfo_.delivery_address.ReceiverPhone);
    }
  }

  // 计算时间
  function computingTime(time1, time2, index) {
    var times1 = new Date(time1).getTime()
    var times2 = new Date(time2).getTime()
    var timeDiff = 24 * 60 * 60 * 1000 * index;
    var times2_ = times2 + timeDiff;
    var diff = (times2_ - times1) / (1000 * 60);
    var h = parseInt(diff / 60);
    var m = parseInt(diff % 60);
    return h + 'h' + m + 'm';
  }
});
