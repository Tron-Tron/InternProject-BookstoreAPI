$(document).ready(function () {
  let curren;
  let inside;
  let flat = true;
  $(".show-popup").click(function () {
    if (flat === true) {
      curren = $(this);
      inside = curren.closest(".customer").find(".container-customer");
      $(inside).fadeIn();
      flat = false;
    }
  });
  $(".close-popup").click(function () {
    if (flat === false) {
      $(inside).fadeOut();
      flat = true;
    }
  });
  let currenImg;
  let insideImg;
  $(".name-product").mouseover(function () {
    currenImg = $(this);
    insideImg = currenImg.find(".img-pro");
    $(insideImg).css("display", "unset");
  });
  $(".name-product").mouseout(function () {
    $(".img-pro").css("display", "none");
  });


});
