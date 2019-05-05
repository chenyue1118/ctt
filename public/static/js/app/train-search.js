$(function() {
  $(".report").on("click", function() {
    $(".mask_").show();
    $(".report-mask").show();
  });

  $(".seize-close").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });
  $(".mask_").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });
  $(".report-btn .btn").on("click", function() {
    $(".mask_").hide();
    $(".report-mask").hide();
  });

});
