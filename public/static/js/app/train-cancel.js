$(function() {
  var checkInfo = sessionStorage.getItem("checkInfo");
  console.log(JSON.parse(checkInfo));
  // api/ticket/refund
  $(".cancel-info .cancel-number").html(GetQueryString("order"));
  $(".detail-con .detail-time").html(JSON.parse(checkInfo).submit_time);

  // refund();
  $(".cancel-order-btn").on("click", function() {
    refund()
  })

  function refund() {
    var url_ = APIURL + "/api/ticket/refund";
    var data = {
      order_number: GetQueryString("order"),
      // refund_passanger_ids: GetQueryString("id"),
      refund_passanger_ids: '3288010F-2D18-4900-890E-68025C5C3130',
      refund_reason: $(".cancel-detal .detail-con").val()
    }
    data = Object.assign(data, getSign("post"))
    $.ajax({
      url: url_,
      data: data,
      dataType: "json",
      type: "post",
      success: function(data) {
        console.log(data);
      }
    })
  }
});
