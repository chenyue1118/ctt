$(function() {
  var order_no = GetQueryString("id");
  var order_email = GetQueryString("email");
  var pay_by = "ipaylinks";
  var orderInfo = '';

  init();
  initPayState();

  $(".submite-wra .success .desc .number").html(order_no);

  //查询订单详情
  $(".submite-wra .success .desc .check").on("click", function() {
    location.href = 'train-details.html';
  });

  // 支付选择
  $(".pay-by .methods .item").on("click", function() {
    $(".pay-by .methods .item .method").removeClass("active");
    $(this).find(".method").addClass("active");
    pay_by = $(this).attr("data-type");
  });

  // 跳转支付
  $(".pay-now-btn").on("click", function() {
    if (pay_by == "ipaylinks") {
      // var PAYURL = "http://39.105.54.233:1001/ipaylinks/payment?order_number=" + orderInfo.order_number + "&member_id=" + 123456 + "&client_ip=" + "39.105.54.233" + "&token=59226165-f455-4ad5-b984-6c8e5462d7ed"+"&terminal=web" + "&web_url=" + encodeURIComponent("http://127.0.0.1:8801/china-trains/train-pay.html?pay_type=ipaylinks&id="+order_no);
      // window.location.href = PAYURL;
    } else if (pay_by == "paypal") {
      if (!orderInfo) return false;
      console.log(orderInfo);
      // $(".item_name").val(orderInfo.order_number);
      $(".p_item_name").val("CTT_BOOKING");
      // $(".p-amount").val(getPaypalPrice(orderInfo.orderamountUSD));
      $(".p-amount").val(10.00);
      $(".p-custom").val(orderInfo.order_number);
      // $(".p-return").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      $(".p-return").val("http://127.0.0.1:8801/china-trains/train-pay.html?pay_type=paypal&id="+order_no);
      $(".cancel_return").val("http://www.chinatraintickets.net/china-trains/my-order.html");
      // $(".p-notify_url").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      $(".p-notify_url").val("http://192.168.1.104:8801/paypal?id="+order_no);

      $("#paypal").submit();
    }
  });

  // =====================================================
  // 查询订单详情
  function init(link) {
    var url_ = APIURL + "/api/order/queryV2?order_number="+order_no+"&email="+order_email+"&" + getSign("get");
    $.ajax({
      url: url_,
      dataType: "json",
      type: "get",
      success: function(data) {
        if (data.code == 1) {
          orderInfo = data.data;
          var data_ = data.data;
          sessionStorage.setItem("checkInfo", JSON.stringify(data_));
          if (link) location.href = 'train-details.html';
          showPrice();
        } else {
          alert(data.message);
        }
      }
    })
  }

  // 展示价格
  function showPrice() {
    $(".grand .grand-num").html("USD"+orderInfo.orderamountUSD);
  }

  // 查询支付状态
  function initPayState() {
    var pay_type = GetQueryString("pay_type");
    if (pay_type == 'paypal') {
      $(".paid-success").show();
      $(".mask_").show();
      $(".paid-success .link-page").off().on("click", function() {
        location.href = '/'
      });
      $(".paid-success .link-order").off().on("click", function() {
        init('ok');
      });
    }
  }
});
