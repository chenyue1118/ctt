$(function() {
  var train_station    = [];        //所有车站
  var train_station_py = [];        //所有车站拼音

  init();

  // 添加 trip
  $(".trip-add").on("click", function() {
    var len = $(".trips .trip").length;
    var str = "";
    if (len == 5) return false
    len = len + 1;
    str += '<li class="trip" id="trip'+len+'">'
            +'<span class="name">Trip '+len+'</span>'
            +'<div class="trip-from-wra">'
              +'<input class="trip-from" type="text" placeholder="From">'
            +'</div>'
            +'<div class="trip-to-wra">'
              +'<input class="trip-to" type="text" placeholder="To">'
            +'</div>'
            +'<div class="trip-time-wra">'
              +'<input class="trip-time" type="text" readonly="readonly" placeholder="DepartDate">'
            +'</div>'
          +'</li>';
    //
    $(".trips").append(str);
    $(".trips #trip"+len+" .trip-time").datepicker({
      numberOfMonths: 2,
      showButtonPanel: false,
      // dateFormat: 'yy-mm-dd',
      dateFormat: 'dd.MM.yy',
      showAnim: 'slideDown',
      minDate: +0
    });
    // 起点初始化
    $(".trips #trip"+len+" .trip-from").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $(".trips #trip"+len+" .trip-from"));
      }
    });
    // 终点初始化
    $(".trips #trip"+len+" .trip-to").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $(".trips #trip"+len+" .trip-to"));
      }
    });
    if (len == 5) $(this).addClass("disable");
    if (len > 1) $(".trip-del").removeClass("disable");
  });

  // 删除 trip
  $(".trip-del").on("click", function() {
    var len = $(".trips .trip").length;
    if (len > 1) {
      len = len - 1;
      $(".trips .trip:eq("+len+")").remove();
      if (len == 1) $(this).addClass("disable");
      if (len < 5) $(".trip-add").removeClass("disable");
    }
  });

  // 光标选中 内容清空 起点
  $(".trips .trip .trip-from").on("focus", function() {
    $(this).val("");
  });

  // 光标选中 内容清空 终点
  $(".trips .trip .trip-to").on("focus", function() {
    $(this).val("");
  });

  $(".trip-search").on("click", function() {
    var arr = [];
    var len = $(".trips .trip").length;
    for (var i = 0; i < len; i++) {
      arr.push({
        from: $(".trips .trip:eq("+i+") .trip-from").attr("data-code"),
        to: $(".trips .trip:eq("+i+") .trip-to").attr("data-code"),
        time: timeFormat($(".trips .trip:eq("+i+") .trip-time").val())
      })
    }
    console.log(arr);
    location.href = "china-trains/train-search.html";
  });

  // ==================================================
  // 初始化数据
  function init() {
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
    $("#trip1 .trip-time").datepicker({
      numberOfMonths: 2,
      showButtonPanel: false,
      // dateFormat: 'yy-mm-dd',
      dateFormat: 'dd.MM.yy',
      showAnim: 'slideDown',
      minDate: +0
    });
    // 起点初始化
    $("#trip1 .trip-from").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#trip1 .trip-from"));
      }
    });
    // 终点初始化
    $("#trip1 .trip-to").autocomplete({
      source: train_station_py,
      select: function(event,ui) {
        setTrainCode(ui.item.value, $("#trip1 .trip-to"));
      }
    });
  }

  function timeFormat(time) {
    var date = new Date(time);
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    mm = mm < 10 ? '0'+mm : mm;
    var dd = date.getDate() + 0;
    dd = dd < 10 ? '0'+dd : dd;
    return yyyy + '-' + mm + '-' + dd;
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

  // 根据拼音查询该城市的code    TODO
  function pyGetCode(py){
    var py = py.toLowerCase();
    var cityCode = "";
    train_station.forEach(function(item){
      if(item.pinyin == py){
        cityCode = item.code;
      }
    });
    return cityCode;
  }

  // 车站首字母大写    正则法
  function firstCap(str){
    str = str.toLowerCase();
    var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
    return str.replace(reg,function(m){
      return m.toUpperCase()
    });
  }
});
