$(function() {
  var order_no = GetQueryString("id");
  var order_email = GetQueryString("email");
  var pay_type = GetQueryString("pay_type");
  var pay_by = "ipaylinks";
  var orderInfo = '';
  var toalPrice = 0;
  var timer = null;

  if (GetQueryString("query")) {
    var queryArr = GetQueryString("query").split("**");
    if (queryArr[0] == "ipaylinks") {
      pay_type = "ipaylinks";
      order_no = queryArr[1];
      order_email = queryArr[2];
    }
  }

  init();
  initPayState();

  $(".submite-wra .success .desc .number").html(order_no);

  //查询订单详情
  $(".submite-wra .success .desc .check").on("click", function() {
    location.href = 'flight-details.html';
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
      var PAYURL = APIURL_IPLINKS + '/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+APIURL+'/api/OrderPay?query=ipaylinks**'+orderInfo.order_number+'**'+orderInfo.email+'&Trans_ID='+getCookie('userId');
      // var PAYURL = APIURL_IPLINKS + '/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+APIURL_IPAYLINKS_RETURN+'/china-trains/train-pay.html?query=ipaylinks**'+orderInfo.order_number+'**'+orderInfo.email+'&Trans_ID='+getCookie('userId');
      // var PAYURL = 'http://39.105.54.233:1004/IPaylinksCTT/Payment?order_number='+orderInfo.order_number+'&email='+orderInfo.email+'&phone_number='+orderInfo.phone_number+'&ReturnURL='+'http://182.61.175.203:8802/china-trains/train-pay.html?pay_type=ipaylinks'+'&Trans_ID='+getCookie('userId');
      window.location.href = PAYURL;
    } else if (pay_by == "paypal") {
      if (!orderInfo) return false;
      var notify_url_ = APIURL + "/api/v_2_0_0/paypal/Postnotify?ordernumber=" + orderInfo.order_number + "&pay_method=paypal&currency=use&total_fee=" + orderInfo.orderamountUSD;
      // var notify_url_ = "http://182.61.175.203:8802/paypal?ordernumber=" + orderInfo.order_number + "&pay_method=paypal&currency=use&total_fee=" + orderInfo.orderamountUSD;
      // $(".item_name").val(orderInfo.order_number);
      $(".p_item_name").val("CTT_BOOKING");
      // $(".p-amount").val(getPaypalPrice(orderInfo.orderamountUSD));
      $(".p-amount").val(toalPrice);
      $(".p-custom").val(orderInfo.order_number);
      // $(".p-return").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      // $(".p-return").val("http://127.0.0.1:8801/china-trains/train-pay.html?pay_type=paypal&id="+order_no+"&email="+orderInfo.email);
      $(".p-return").val(APIURL_PAYPAL_RETURN + "/china-flights/flight-pay.html?pay_type=paypal&id="+order_no+"&email="+orderInfo.email);
      $(".cancel_return").val(APIURL_PAYPAL_RETURN + "/china-flights/flight-pay.html?pay_type=paypal&id="+order_no+"&email="+orderInfo.email);
      // $(".p-notify_url").val("http://www.chinatraintickets.net/china-trains/pay_ok.html?pay_type=paypal&orderid="+GetQueryString("orderid"));
      // $(".p-notify_url").val("http://182.61.175.203:8801/paypal?id="+order_no);
      $(".p-notify_url").val(notify_url_);
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
          sessionStorage.setItem("checkInfoFlight", JSON.stringify(data_));
          if (link) location.href = 'flight-details.html';
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
        $(".loading").show();
        setTimeout(function() {
          init('ok');
          $(".loading").hide();
        }, 4000)
      });
    } else if (pay_type == 'ipaylinks') {
      $(".paid-success").show();
      $(".mask_").show();
      $(".paid-success .link-page").off().on("click", function() {
        location.href = '/'
      });
      $(".paid-success .link-order").off().on("click", function() {
        $(".loading").show();
        setTimeout(function() {
          init('ok');
          $(".loading").hide();
        }, 4000)
      });
    }
  }

  // 占座
  // function seatOcc(time){
  //   // var now = new Date().getTime();
  //   var now = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
  //   var cTime = new Date(time.replace('-', '/').replace('-', '/') + ' 00:00:00').getTime();
  //   // 支付成功
  //   if ((pay_type == 'paypal' || pay_type == 'ipaylinks') && now > cTime) {
  //     // TODO:
  //     $(".wait-loading").show();
  //     submitNew();
  //   }
  // }

  function compute30(time) {
    var now = new Date().getTime() + 30 * 60 * 60 * 1000;
    var cTime = new Date(time.replace('-', '/').replace('-', '/') + ' 00:00:00');
    return cTime > cTime ? true : false;
  }

  // 提交订单占座(新) '&phone_number='+orderInfo.phone_number
  function submitNew() {
    var url_ = APIURL + "/api/order/submitNew";
    var data = {
      order_number: order_no,
      email: order_email,
      phone_number: orderInfo.phone_number
    }
    data = Object.assign(data, getSign("post"))
    $.ajax({
      url: url_,
      data: data,
      dataType: "json",
      type: "post",
      success: function(data) {
        orderStatusJH()
        // if (data.code == 1) {
        //   orderStatusJH()
        // } else {
        //   alert(data.message);
        //   $(".wait-loading").hide();
        // }
      }
    })
  }

  // 聚合查询占座接口   api/order/orderStatusJH
  function orderStatusJH() {
    var url_ = APIURL + "/api/order/orderStatusJH";
    var data = {
      order_number: order_no,
      email: order_email,
      phone_number: orderInfo.phone_number
    }
    data = Object.assign(data, getSign("post"))
    $.ajax({
      url: url_,
      data: data,
      dataType: "json",
      type: "post",
      success: function(data) {
        if (data.code == 1) {
          if (data.data == 2) {
            orderticketpay()
          } else if (data.data == 1) {
            setTimeout(function() {
              orderStatusJH()
            }, 5000)
          } else {
            // alert(data.message);
            $(".wait-loading").hide();
          }
        } else {
          alert(data.message);
          $(".wait-loading").hide();
        }
      }
    })
  }

  // 占座成功---去出票http://64.50.179.33/api/ticket/pay----支付完成就会出票
  function orderticketpay() {
    var url_ = APIURL + "/api/ticket/pay";
    var data = {
      order_number: order_no
    }
    data = Object.assign(data, getSign("post"))
    $.ajax({
      url: url_,
      data: data,
      dataType: "json",
      type: "post",
      success: function(data) {
        if (data.code == 1) {
          alert('Successful ticket issuance')
          $(".loading").show();
          setTimeout(function() {
            init('ok');
            $(".loading").hide();
          }, 4000)
        } else {
          alert(data.message);
          $(".wait-loading").hide();
        }
      }
    })
  }


});
