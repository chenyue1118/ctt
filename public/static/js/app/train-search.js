$(function() {

  var train_data       = [];        //存储车次信息  价格余票等
  var sel_train_data   = [];        //筛选 车次信息
  var train_station    = [];        //所有车站
  var train_station_py = [];        //所有车站拼音
  var orderInfo = [];
  var ss_index = 0;

  getStation();

  var trainInfo = sessionStorage.getItem("trainInfo");
  if (trainInfo) trainInfo = JSON.parse(trainInfo);
  if (trainInfo && trainInfo.length > 0) {
    showTrainSelectInfo(trainInfo);
  } else {
    trainInfo = [{
      from: '',
      to: '',
      time: ''
    }];
  }

  // 初始化车次查询
  init();

  // 车次搜索初始化
  trainInit();


  // $(".search-noresult-wra").hide();
  // TODO: 2019-05-10  根据时间渲染
  // showTimeList('2019-05-10')

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
    $(".search-trip-wra .active .trip-time").val(time_);
    trainInfo[ss_index].time = time_;
    $(".screen-time .item").removeClass("active");
    $(this).addClass("active");
    trainSearch(trainInfo[ss_index].from, trainInfo[ss_index].to, trainInfo[ss_index].time, ss_index);
  });

  // 车次选择
  $(".search-result-wrapper .result-content").on("click", ".btn", function() {
    var train_time   = $(this).parents(".seat-btn").attr("data-time");
    var train_from   = $(this).parents(".seat-btn").attr("data-fromCode");
    var train_to     = $(this).parents(".seat-btn").attr("data-toCode");
    var train_code   = $(this).parents(".seat-btn").attr("data-trainCode");
    var train_duration = $(this).parents(".seat-btn").attr("data-duration");
    var start_time   = $(this).parents(".seat-btn").attr("data-start_time");
    var arrive_time   = $(this).parents(".seat-btn").attr("data-arrive_time");
    var arrive_days   = $(this).parents(".seat-btn").attr("data-arrive_days");
    var service_Fee   = $(this).parents(".seat-btn").attr("data-ServiceFee");
    var train_price  = $(this).attr("data-price");
    var train_zwcode = $(this).attr("data-zwcode");
    orderInfo.push({
      "train_time": train_time,
      "train_from": train_from,
      "train_to": train_to,
      "train_code": train_code,
      "train_duration": train_duration,
      "start_time": start_time,
      "arrive_time": arrive_time,
      "train_price": train_price,
      "train_zwcode": train_zwcode,
      "arrive_days": arrive_days,
      "ServiceFee": service_Fee
    });
    // ss_index = ss_index + 1;
    // if (trainInfo && trainInfo.length > ss_index) {
    //   trainSearch(trainInfo[ss_index].from, trainInfo[ss_index].to, trainInfo[ss_index].time, ss_index);
    //   showTimeList(trainInfo[ss_index].time);
    //   $(".search-trip-wra .item").removeClass("active");
    //   $(".search-trip-wra .item:eq("+ss_index+")").addClass("active");
    // } else {
      console.log(orderInfo);
      alert("下订单页面");
      sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
      location.href = "train-booking.html";
    // }
    // sessionStorage.setItem("orderInfoPara",JSON.stringify(orderInfoPara));
  });

  // 车次搜索
  $(".search-trip-wra").on("click", ".trip-search", function() {
    trainInfo[ss_index].from = $("#search-train-from").attr("data-code");
    trainInfo[ss_index].to = $("#search-train-to").attr("data-code");
    trainInfo[ss_index].time = $("#search-train-time").val();
    // trainInfo[ss_index].from = $(this).parents(".item").find(".trip-from").attr("data-code");
    // trainInfo[ss_index].to = $(this).parents(".item").find(".trip-to").attr("data-code");
    // trainInfo[ss_index].time = $(this).parents(".item").find(".trip-time").val();
    init();
  });

  // 数据筛选
  $("input[name='trainType']").on("change", function() {
    if ($(this).val() == 'all') {
      $("input[name='trainType']").prop("checked", true);
      sel_train_data = train_data.slice(0);
      showTrian(sel_train_data);
    } else {
      var gdc = $("#type-gdc").val()
      var ztk = $("#type-ztk").val()
      var other = $("#type-other").val()
      var trainArr = [];
      var str = "";
      if ($("#type-gdc").prop("checked")) {
        str += $("#type-gdc").val();
      }
      if ($("#type-ztk").prop("checked")) {
        str += $("#type-ztk").val();
      }
      if ($("#type-other").prop("checked")) {
        str += $("#type-other").val();
      }
      console.log(str);
      train_data.forEach(function(item) {
        if (str.indexOf(item.train_type) > -1) trainArr.push(item)
      })
      showTrian(trainArr);
    }
  });
  // 数据筛选
  $("input[name='departureTime']").on("change", function() {
    if ($(this).val() == 'all') {
      $("input[name='departureTime']").prop("checked", true);
      sel_train_data = train_data.slice(0);
      showTrian(sel_train_data);
    } else {
      var time08 = $("#time-08").val()
      var time12 = $("#time-12").val()
      var time18 = $("#time-18").val()
      var time24 = $("#time-24").val()
      var trainArr = [];
      var arr = [];
      if ($("#time-08").prop("checked")) {
        arr.push($("#time-08").val());
      }
      if ($("#time-12").prop("checked")) {
        arr.push($("#time-12").val());
      }
      if ($("#time-18").prop("checked")) {
        arr.push($("#time-18").val());
      }
      if ($("#time-24").prop("checked")) {
        arr.push($("#time-24").val());
      }
      train_data.forEach(function(item) {
        arr.forEach(function(list) {
          var index1 = parseInt(list.split("-")[0]);
          var index2 = parseInt(list.split("-")[1]);
          var index3 = parseInt(item.start_time.split(":")[0]) * 60 + parseInt(item.start_time.split(":")[1]);
          if (index3 >= index2 && index3 < index1) trainArr.push(item)
        })
      })
      showTrian(trainArr);
    }
  });

  // ==========================================================
  // 初始化数据
  function trainInit() {
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
    // 日期初始化
    $("#search-train-time").datepicker({
      numberOfMonths: 2,
      showButtonPanel: false,
      dateFormat: 'yy-mm-dd',
      showAnim: 'slideDown',
      minDate: +0
    });
    // 起点初始化
    $("#search-train-from").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#search-train-from"));
      }
    });
    // 终点初始化
    $("#search-train-to").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#search-train-to"));
      }
    });
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

  // 初始化车次查询信息
  function init() {
    if (trainInfo && trainInfo.length) {
      trainSearch(trainInfo[ss_index].from, trainInfo[ss_index].to, trainInfo[ss_index].time, ss_index);
      showTimeList(trainInfo[ss_index].time);
    } else {

    }
  }

  // 展示搜索信息列表
  function showTrainSelectInfo(trainInfo) {
    if (trainInfo && trainInfo.length > 0) {
      $(".search-trip-wra .head .active .trip-from").val(codeGetPy(trainInfo[0].from, "en"));
      $(".search-trip-wra .head .active .trip-from").attr("data-code", trainInfo[0].from);
      $(".search-trip-wra .head .active .trip-to").val(codeGetPy(trainInfo[0].to, "en"));
      $(".search-trip-wra .head .active .trip-to").attr("data-code", trainInfo[0].to);
      $(".search-trip-wra .head .active .trip-time").val(trainInfo[0].time);
    }
    // var str = "";
    // trainInfo && trainInfo.forEach(function(item, index) {
    //   var index_ = index + 1;
    //   var active = index == ss_index ? 'active': '';
    //   str += '<li class="item '+active+'">'
    //     +'<span class="trip">Trip'+index_+'</span>'
    //     +'<div class="trip-from-wra">'
    //       +'<input class="trip-from" type="text" placeholder="From" data-code="'+item.from+'" value="'+codeGetPy(item.from, "en")+'">'
    //     +'</div>'
    //     +'<div class="trip-to-wra">'
    //       +'<input class="trip-to" type="text" placeholder="To" data-code="'+item.to+'" value="'+codeGetPy(item.to, "en")+'">'
    //     +'</div>'
    //     +'<div class="trip-time-wra">'
    //       +'<input class="trip-time" type="text" placeholder="DepartDate" value="'+item.time+'">'
    //     +'</div>'
    //     +'<a class="trip-search">'
    //       +'Find Train'
    //       +'<i class="find-icon"></i>'
    //     +'</a>'
    //   +'</li>';
    // })
    // $(".search-trip-wra .head").html(str);
  }

  // 车次查询
  function trainSearch(from, to, time, index) {
    if (!from) return false;
    if (!to) return false;
    if (!time) return false;
    var index_ = parseInt(index) + 1;
    var url_ = APIURL + "/api/ticket/queryV2?from_station=" + from + "&to_station=" + to + "&train_date=" + time + "&" + getSign("get");
    $(".search-detail-wrapper .trip").html("Trip" + index_);
    $(".search-detail-wrapper .detail-address-from").html(codeGetPy(from));
    $(".search-detail-wrapper .detail-address-to").html(codeGetPy(to));
    $(".loading").show();
    $.ajax({
      url: url_,
      dataType: "json",
      type: "get",
      success: function(data) {
        $(".loading").hide();
        if (data.code == 1) {
          $(".search-detail-wrapper .detail .num").html(data.data.length);
          if (data.data.length > 0) {
            $(".search-noresult-wra").hide();
            train_data = data.data.slice(0);
            sel_train_data = data.data.slice(0);
            showTrian(train_data);
          } else {
            $(".search-noresult-wra").show();
          }
        } else {
          alert("No travel plans were found!")
        }
      }
    });
  }

  //根据车次信息  展示信息
  function showTrian(arr) {
    $(".search-result-wrapper .result-content .item").remove();      //先清空车次信息
    arr && arr.forEach(function(item){
      console.log(item.ServiceFee);
      ExchangeRate = item.ExchangeRate;
      setCookie('ExchangeRate', ExchangeRate);
      ServiceFee = item.ServiceFee;
      $(".search-result-wrapper .result-content").append(accSeat(item));
    });
  }

  // 根据车次类型 去显示不同的座位
  function accSeat(item) {
    var run_time = item.run_time.split(":")[0] + "h" + item.run_time.split(":")[1] + "m";
    var str1 = '<li class="item">'
                  +'<span class="train-number">'+item.train_code+'</span>'
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
                    +'<span class="from">'+firstCap(codeGetPy(item.from_station_code))+'</span>'
                    +'<span class="to">'+firstCap(codeGetPy(item.to_station_code))+'</span>'
                  +'</div>'
                  +'<div class="dur">'
                    +run_time
                  +'</div>'
                  +'<div class="dur-line"></div>';
    if (item.train_type == "G" || item.train_type == "C") {
      var str2 = '<div class="seat">'
                    +'<span class="seat-type">2nd Cls.</span>'
                    +'<span class="seat-type">1nd Cls.</span>'
                    +'<span class="seat-type">Business Cls</span>'
                  +'</div>'
                  +'<div class="seat-number">'
                    +'<span class="number">'+item.edz_num+'</span>'
                    +'<span class="number">'+item.ydz_num+'</span>'
                    +'<span class="number">'+item.swz_num+'</span>'
                  +'</div>'
                  +'<div class="seat-price">'
                    +'<span class="price-detail">RMB'+item.edz_price+'/USD'+priceExchangeRate(item.edz_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.ydz_price+'/USD'+priceExchangeRate(item.ydz_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.swz_price+'/USD'+priceExchangeRate(item.swz_price, ExchangeRate)+'</span>'
                  +'</div>'
                  +'<div class="seat-btn" data-time="'+item.train_start_date+'" data-fromCode="'+item.from_station_code+'" data-toCode="'+item.to_station_code+'" data-trainCode="'+item.train_code+'" data-duration="'+item.run_time+'" data-start_time="'+item.start_time+'" data-arrive_time="'+item.arrive_time+'" data-arrive_days="'+item.arrive_days+'" data-ServiceFee="'+item.ServiceFee+'">'
                    +'<a class="btn '+setBookSty(item.edz_num)+'" data-price='+item.edz_price+' data-zwcode="O">Continue</a>'
                    +'<a class="btn '+setBookSty(item.ydz_num)+'" data-price='+item.ydz_price+' data-zwcode="M">Continue</a>'
                    +'<a class="btn '+setBookSty(item.swz_num)+'" data-price='+item.swz_price+' data-zwcode="9">Continue</a>'
                  +'</div>'
                +'</li>';
    } else if (item.train_type == "D") {
      var str2 = '<div class="seat">'
                    +'<span class="seat-type">2nd Cls.</span>'
                    +'<span class="seat-type">1nd Cls.</span>'
                    +'<span class="seat-type">CRH Berth</span>'
                  +'</div>'
                  +'<div class="seat-number">'
                    +'<span class="number">'+item.edz_num+'</span>'
                    +'<span class="number">'+item.ydz_num+'</span>'
                    +'<span class="number">'+item.dw_num+'</span>'
                  +'</div>'
                  +'<div class="seat-price">'
                    +'<span class="price-detail">RMB'+item.edz_price+'/USD'+priceExchangeRate(item.edz_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.ydz_price+'/USD'+priceExchangeRate(item.ydz_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.dw_price+'/USD'+priceExchangeRate(item.dw_price, ExchangeRate)+'</span>'
                  +'</div>'
                  +'<div class="seat-btn" data-time="'+item.train_start_date+'" data-fromCode="'+item.from_station_code+'" data-toCode="'+item.to_station_code+'" data-trainCode="'+item.train_code+'" data-duration="'+item.run_time+'" data-start_time="'+item.start_time+'" data-arrive_time="'+item.arrive_time+'" data-arrive_days="'+item.arrive_days+'" data-ServiceFee="'+item.ServiceFee+'">'
                    +'<a class="btn '+setBookSty(item.edz_num)+'" data-price='+item.edz_price+' data-zwcode="O">Continue</a>'
                    +'<a class="btn '+setBookSty(item.ydz_num)+'" data-price='+item.ydz_price+' data-zwcode="M">Continue</a>'
                    +'<a class="btn '+setBookSty(item.dw_num)+'" data-price='+item.dw_price+' data-zwcode="F">Continue</a>'
                  +'</div>'
                +'</li>';
    } else if (item.train_type == "Z" || item.train_type == "K" || item.train_type == "T" || item.train_type == "1" || item.train_type == "2" || item.train_type == "Y" || item.train_type == "6") {
      var str2 = '<div class="seat">'
                    +'<span class="seat-type">Soft Sleeper</span>'
                    +'<span class="seat-type">Hard Sleeper</span>'
                    +'<span class="seat-type">Soft Seat</span>'
                  +'</div>'
                  +'<div class="seat-number">'
                    +'<span class="number">'+item.rw_num+'</span>'
                    +'<span class="number">'+item.yw_num+'</span>'
                    +'<span class="number">'+item.yz_num+'</span>'
                  +'</div>'
                  +'<div class="seat-price">'
                    +'<span class="price-detail">RMB'+item.rw_price+'/USD'+priceExchangeRate(item.rw_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.yw_price+'/USD'+priceExchangeRate(item.yw_price, ExchangeRate)+'</span>'
                    +'<span class="price-detail">RMB'+item.yz_price+'/USD'+priceExchangeRate(item.yz_price, ExchangeRate)+'</span>'
                  +'</div>'
                  +'<div class="seat-btn" data-time="'+item.train_start_date+'" data-fromCode="'+item.from_station_code+'" data-toCode="'+item.to_station_code+'" data-trainCode="'+item.train_code+'" data-duration="'+item.run_time+'" data-start_time="'+item.start_time+'" data-arrive_time="'+item.arrive_time+'" data-arrive_days="'+item.arrive_days+'" data-ServiceFee="'+item.ServiceFee+'">'
                    +'<a class="btn '+setBookSty(item.rw_num)+'" data-price='+item.rw_price+' data-zwcode="4">Continue</a>'
                    +'<a class="btn '+setBookSty(item.yw_num)+'" data-price='+item.yw_price+' data-zwcode="3">Continue</a>'
                    +'<a class="btn '+setBookSty(item.yz_num)+'" data-price='+item.yz_price+' data-zwcode="1">Continue</a>'
                  +'</div>'
                +'</li>';
    }
    return str1+str2;
  }

  // 如果车票余票为 0 / --  book的样式
  function setBookSty(num){
    var num = num;
    var str;
    if(num == 0 || num == "--"){
      str = "show-item-disable";
    }else{
      str = "";
    }
    return str;
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

  // 查询车次信息展示
  // function showTrainInfo(arr, index) {
  //   var index_ = parseInt(index) + 1;
  //   $(".trip-from").val(codeGetPy(arr[index].from, "en"));
  //   $(".trip-from").attr("data-code", arr[index].from);
  //   $(".trip-to").val(codeGetPy(arr[index].to, "en"));
  //   $(".trip-to").attr("data-code", arr[index].to);
  //   $(".trip-time").val(arr[index].time);
  //   $(".search-trip-wra .head .item .trip").html("Trip"+index_);
  // }

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

  // 根据城市信息来设置对应的CODE   Beijing(北京) --> BJP
  function setTrainCode(value,dom){
    var value = value.split("(")[1].split(")")[0];
    var code = ZhGetCode(value);
    dom.attr("data-code", code);
  }

  // 根据城市的中文来查询code
  function ZhGetCode(zh){
    var zh = zh;
    var cityCode = "";
    train_station.forEach(function(item){
      if(item.name == zh){
        cityCode = item.code;
      }
    });
    return cityCode;
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

});
