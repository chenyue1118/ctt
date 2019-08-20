$(function() {
  console.log(flightCityCode);
  var flightCityCodeSelect = [];

  init();

  $(".trip-search").on("click", function() {
    var from = $("#trip-from").val();
    var from_code = $("#trip-from").attr("data-code");
    var to = $("#trip-to").val();
    var to_code = $("#trip-to").attr("data-code");
    var date = $("#trip-time").val();
    if (!from_code) {
       $("#trip-from").val("");
       $("#trip-from").focus();
       return false;
    }
    if (!to_code) {
      $("#trip-to").val("");
      $("#trip-to").focus();
      return false;
    }
    if (!date) {
       $("#trip-time").val("");
       $("#trip-time").focus();
       return false;
    }
    location.href = `flight-search.html?from=${from}&to=${to}&from_code=${from_code}&to_code=${to_code}&date=${date}`;
  })

  // =======================================================
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
  }

  // 根据城市信息来设置对应的CODE   Beijing(北京) --> BJP
  function setTrainCode(value, dom){
    flightCityCode && flightCityCode.forEach(function(item) {
      if (item[1] == value) dom.attr("data-code", item[0]);
    })
  }
});
