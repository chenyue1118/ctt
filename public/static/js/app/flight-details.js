$(function() {
  var checkInfoFlight = sessionStorage.getItem("checkInfoFlight");
  if (checkInfoFlight) init();

  // 跳转首页
  $(".order-details_ .nav .home").on("click", function() {
    location.href = "./index.html";
  });
  $(".order-details_ .nav .search").on("click", function() {
    location.href = "flight-search.html";
  });

  console.log(checkInfoFlight);
  console.log(JSON.parse(checkInfoFlight));

  function init() {
    var checkInfo = JSON.parse(checkInfoFlight);
    $(".detail-title .number").html("Tarching No.: " + checkInfo.order_number);
    $(".detail-title .time").html("Submit Time: " + checkInfo.submit_time);
    $(".grand-total").html("Grand Total: <span class='num'>CNY"+checkInfo.orderamount+"/USD"+checkInfo.orderamountUSD+"</span>");
    $(".plant-type").html('Fight No.<span class="spe"> '+checkInfo.checi.split('*=*')[1]+' </span> From <span class="spe"> '+checkInfo.from_station_name+' Capital</span> To <span class="spe"> '+checkInfo.to_station_name+' Airport</span>');
    $(".plant-date").html('Departure:<span class="spe">'+checkInfo.train_date+'&nbsp;&nbsp;'+checkInfo.start_time+'</span>&nbsp;&nbsp;&nbsp;&nbsp;Arrival:<span class="spe">'+checkInfo.arrive_time+'</span>');
    var guestStr = "";
    var ticketStr ="";
    var from_station_code = {
      flightNumber: '',
      terminal: ''
    };
    var to_station_code ={
      flightNumber: '',
      terminal: ''
    }
    try {
      var from_station_code_ = JSON.parse(checkInfo.from_station_code);
      var to_station_code_ = JSON.parse(checkInfo.from_station_code);
      from_station_code.flightNumber = from_station_code_.flightNumber;
      from_station_code.terminal = from_station_code_.terminal;
      to_station_code.flightNumber = to_station_code_.flightNumber;
      to_station_code.terminal = to_station_code_.terminal;
    } catch (e) {
      console.log("获取航班错误");
    }
    checkInfo.passengers && checkInfo.passengers.forEach(function(item) {
      var name = {
        sur: '',
        giv: '',
        nat: ''
      };
      try {
        var name_ = JSON.parse(item.passengersename);
        name.sur = name_.sur;
        name.giv = name_.giv;
        name.nat = name_.nat;
      } catch (e) {
        console.log('信息获取失败');
      }
      guestStr += `<li class="item">
        <span class="con">Adult1.</span>
        <span class="con">${name.sur}</span>
        <span class="con">${name.giv}</span>
        <span class="con">${name.nat}</span>
        <span class="con">${item.passportseno}</span>
        <span class="con">-</span>`;
    })
    $(".ticket-personnel").html(guestStr);
    ticketStr += `<div class="head">
      <div class="left">
        <span class="index">Trip 1</span>
        <span class="date">${checkInfo.train_date}</span>
      </div>
      <div class="right details-paid-state">
        <span class="status">-</span>
      </div>
    </div>
    <div class="flights">
      <div class="flight-info">
        <div class="info-name">
          <i class="icon-flight-name"></i>
          <span class="txt-flight-name">${checkInfo.checi.split('*=*')[1]}</span>
        </div>
        <div class="flight-aircraft">
          Aircraft: ${checkInfo.checi.split('*=*')[0]}
        </div>
        <div class="flight-desc">
          <div class="flight-desc-wra">
            <span class="flight-desc-txt">China Airlines</span>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="lines">
          <span class="from"></span>
          <span class="line"></span>
          <span class="to"></span>
        </div>
        <div class="time">
          <span class="from">${checkInfo.start_time}</span>
          <span class="to">${checkInfo.arrive_time}</span>
        </div>
        <div class="address">
          <span class="from">${from_station_code.flightNumber}(${from_station_code.terminal})</span>
          <span class="to">${from_station_code.flightNumber}(${from_station_code.terminal})</span>
        </div>
      </div>
      <div class="time-seating">
        <span class="seating">${checkInfo.passengers[0].zwname}</span>
      </div>
      <div class="ticket-price">
        <div class="price-info-wra">
          <span class="price-name">Price:</span>
          <ul class="price-info">
            <li class="item">CNY${checkInfo.orderamount}/US$${checkInfo.orderamountUSD} x <span class="num">${checkInfo.passengers.length}</span> Adult</li>
          </ul>
        </div>
        <div class="price-tax">
          Tax:	CNY50(US$8) x ${checkInfo.passengers.length} Adult
        </div>
        <div class="total">
          Total: CNY${checkInfo.orderamount}/USD${checkInfo.orderamountUSD}
        </div>
      </div>
    </div>`;
    $(".flights-ticket-personnel").html(ticketStr);
    $(".tic-per-email").html(checkInfo.email);
    $(".tic-per-phone").html(checkInfo.phone_number);
    if (checkInfo.status == 0) {
      $(".details-paid-state").html('<span class="status unpaid">Unpaid</span>');
    } else if (checkInfo.status == 1) {
      $(".details-paid-state").html('<span class="status paid">Paid</span>');
    } else if (checkInfo.status == 3 || checkInfo_.status == 5) {
      $(".details-paid-state").html('<span class="status name" style="color: green">Successful ticketing</span>');
    } else if (checkInfo.status == 4 || checkInfo_.status == 6) {
      $(".details-paid-state").html('<span class="status name" style="color: red">Failure ticketing</span>');
    } else if (checkInfo.status == 8) {
      $(".details-paid-state").html('<span class="status name" style="color: green">Successful refund</span>');
    } else if (checkInfo.status == 9) {
      $(".details-paid-state").html('<span class="status name" style="color: red">Failure refund</span>');
    }
  }
})
