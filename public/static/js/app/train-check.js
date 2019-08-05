$(function(){
  // 搜索订单详情
  $(".con-search-btn").on("click", function() {
    var checkNo = $(".check-no").val();
    var checkEmail = $(".check-email").val();
    if (!checkNo) {
      $(".check-no").focus();
      return false;
    }
    if (!checkEmail) {
      $(".check-email").focus();
      return false;
    }
    // var url_ = APIURL + "/api/order/queryV2?order_number="+checkNo+"&email="+checkEmail+"&phone_number="+checkPhone+"&" + getSign("get");
    var url_ = APIURL + "/api/order/queryV2?order_number="+checkNo+"&email="+checkEmail+"&" + getSign("get");
    $.ajax({
      url: url_,
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.code == 1) {
          var data = data.data;
          sessionStorage.setItem("checkInfo", JSON.stringify(data));
          location.href = 'train-details.html';
        } else {
          alert(data.message);
        }
      }
    })
  });

  // 跳转首页
  $(".check-order_ .home").on("click", function() {
    location.href = "/";
  });
});
