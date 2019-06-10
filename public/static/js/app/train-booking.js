$(function(){
  var orderInfo = sessionStorage.getItem("orderInfo");
  if (orderInfo) orderInfo = JSON.parse(orderInfo);
  var  train_station = [];
  var  train_station_py = [];
  console.log(orderInfo);

  getStation();
  init();

  // ===========================================================
  // 初始化数据
  function init() {
    // +'<li class="item">Children: CNY933/US$141 X <span class="num">0</span></li>'
    if (!orderInfo) return false;
    var str = "";
    orderInfo.forEach(function(item, index) {
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
                      +'<li class="item">Service Fee: US$'+item.train_price+' X <span class="num">1</span></li>'
                    +'</ul>'
                    +'<div class="total">'
                      +'Total: US$'+item.train_price
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</li>'
    })
    $(".mytrip .trips .trip").remove();
    $(".mytrip .trips").prepend(str);
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
