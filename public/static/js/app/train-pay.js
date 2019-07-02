$(function() {
  var order_no = GetQueryString("id");
  var order_email = GetQueryString("email");
  var pay_type = GetQueryString("pay_type");
  var pay_by = "ipaylinks";
  var orderInfo = '';
  var toalPrice = 0;

  // if (pay_type) {
  //   pay_type = pay_type.s
  // }

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
      // http://39.105.54.233:1004/IPaylinksCTT/Payment?order_number=<这是填入CTT订单号>&email=<这里填入客户下单时的邮件地址>&phone_number=<这里填入客户下单的手机号>&ReturnURL=<支付结果返回后回调显示的URL>&Trans_ID=<客户下单后返回的交易ID>
      var PAYURL = 'http://39.105.54.233:1004/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+'http://182.61.175.203:8802/china-trains/train-pay.html?pay_type=ipaylinks'+'&Trans_ID='+getCookie('userId');
      // var PAYURL = 'http://39.105.54.233:1004/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+'http://182.61.175.203:8802/china-trains/train-pay.html?pay_type=paypal'+'&Trans_ID='+orderInfo.order_number;
      // var PAYURL = 'http://39.105.54.233:1004/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+'http://127.0.0.1:8801/china-trains/train-pay.html'+'&Trans_ID='+orderInfo.user_orderid;
      window.location.href = PAYURL;
    } else if (pay_by == "paypal") {
      if (!orderInfo) return false;
      console.log(orderInfo);
      var notify_url_ = APIURL_US + "/api/v_2_0_0/paypal/notify?ordernumber=" + orderInfo.order_number + "&pay_method=paypal&currency=use&total_fee=" + orderInfo.orderamountUSD;
      // var notify_url_ = "http://182.61.175.203:8802/paypal?ordernumber=" + orderInfo.order_number + "&pay_method=paypal&currency=use&total_fee=" + orderInfo.orderamountUSD;
      // $(".item_name").val(orderInfo.order_number);
      $(".p_item_name").val("CTT_BOOKING");
      // $(".p-amount").val(getPaypalPrice(orderInfo.orderamountUSD));
      $(".p-amount").val(toalPrice);
      $(".p-custom").val(orderInfo.order_number);
      // $(".p-return").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      $(".p-return").val("http://127.0.0.1:8801/china-trains/train-pay.html?pay_type=paypal&id="+order_no+"&email="+orderInfo.email);
      $(".cancel_return").val("http://www.chinatraintickets.net/china-trains/my-order.html");
      // $(".p-notify_url").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      $(".p-notify_url").val("http://182.61.175.203:8801/paypal?id="+order_no);
      // $(".p-notify_url").val(notify_url_);
      alert(notify_url_);
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
    var price1 = orderInfo.orderamountUSD;
    var price2 = priceExchangeRate(ServiceFee, ExchangeRate);
    var price3 = 7;
    // $(".grand .grand-num").html("USD"+orderInfo.orderamountUSD);
    $(".total-price .price1").html("Total Price for Tikets: USD" + price1);
    $(".total-price .price2").html("");
    if (orderInfo.delivery_method == 1) {
      price3 = 0;
      $(".total-price .icon3").hide();
      $(".total-price .price3").hide();
    }
    toalPrice = Number(price1) + Number(price3);
    toalPrice = toalPrice.toFixed(2);
    $(".grand .grand-num").html("USD"+toalPrice);
  }

  // 查询支付状态
  function initPayState() {
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
