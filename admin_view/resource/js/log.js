$(document).ready(function () {
  // $("#myform").validate({
  //   onfocusout: false,
  //   onkeyup: false,
  //   onclick: false,
  //   rules: {
  //     email: {
  //       required: true,
  //       email: true,
  //     },
  //     password: {
  //       required: true,
  //       minlength: 8,
  //     },
  //     "re-password": {
  //       equalTo: "#password",
  //       minlength: 8,
  //     },
  //     phonenumber: {
  //       required: true,
  //       digits: true,
  //       maxlength: 10,
  //       minlength: 10,
  //     },
  //     "name-user": {
  //       required: true,
  //     },
  //     address: {
  //       required: true,
  //     },
  //   },
  //   messages: {
  //     email: {
  //       required: "Bắt buộc nhập email",
  //       email: "Nhập đúng chuẩn email",
  //     },
  //     password: {
  //       required: "Bắt buộc nhập password",
  //       minlength: "Hãy nhập ít nhất 8 ký tự",
  //     },
  //     "re-password": {
  //       equalTo: "Hai password phải giống nhau",
  //       minlength: "Hãy nhập ít nhất 8 ký tự",
  //     },
  //     phonenumber: {
  //       required: "Bắt buộc nhập số điện thoại",
  //       digits: "Vui lòng nhập số",
  //     },
  //     "name-user": {
  //       required: "Bắt buộc nhập tên người dùng",
  //     },
  //     address: {
  //       required: "Bắt buộc nhập địa chỉ",
  //     },
  //   },
  // });

  $("#btn-submit-sign-up").click(function () {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regex_phone = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    let email_check = $("#email").val();
    let pass_check = $("#password").val();
    let repass_check = $("#re-password").val();
    let phone = $("#phonenumber").val();
    let name_user = $("#name-user").val();
    let address = $("#address").val();


    if (email_check === "" || !email_check.match(re)) {
      $("#email").css("border", "1px solid red");
      $("#email").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#email").css("border", "unset");
        $("#email").css("background-color", "unset");
      }, 3000);
    }
    if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
      $("#password").css("border", "1px solid red");
      $("#password").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#password").css("border", "unset");
        $("#password").css("background-color", "unset");
      }, 3000);
    }

    if (!pass_check.match(repass_check)) {
      $("#re-password").css("border", "1px solid red");
      $("#re-password").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#re-password").css("border", "unset");
        $("#re-password").css("background-color", "unset");
      }, 3000);
    }

    if (!phone.match(regex_phone) || phone === "") {
      $("#phonenumber").css("border", "1px solid red");
      $("#phonenumber").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#phonenumber").css("border", "unset");
        $("#phonenumber").css("background-color", "unset");
      }, 3000);
    }

    if (name_user === "") {
      $("#name-user").css("border", "1px solid red");
      $("#name-user").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#name-user").css("border", "unset");
        $("#name-user").css("background-color", "unset");
      }, 3000);
    }

    if (address === "") {
      $("#address").css("border", "1px solid red");
      $("#address").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#address").css("border", "unset");
        $("#address").css("background-color", "unset");
      }, 3000);
    }
  });

  $("#close-popup-sign-up").click(function () {
    $("input").val("");
  });

  $("#btn-submit-sign-up").click(function () {
    if ($("#check-notify").is(":checked")) {
      $("#text-notify-sign-up").css({
        "border-color": "",
        "border-width": "0px",
      });
    } else if ($("#check-notify").is(":not(:checked)")) {
      $("#text-notify-sign-up").css({
        "border-color": "red",
        "border-width": "1px",
        "border-style": "solid",
      });
    }
  });

  // bật tắt password

  // đăng kí
  $("#show-pass").click(function () {
    $("#password").attr("type", "text");
    $("#hide-pass").css("display", "unset");
  });
  $("#hide-pass").click(function () {
    $("#password").attr("type", "password");
    $("#hide-pass").css("display", "none");
  });
  // đăng nhập
  $("#show-pass-s").click(function () {
    $("#password-s").attr("type", "text");
    $("#hide-pass-s").css("display", "unset");
  });
  $("#hide-pass-s").click(function () {
    $("#password-s").attr("type", "password");
    $("#hide-pass-s").css("display", "none");
  });

  // validate của form đăng nhập

  // $("#myform-s").validate({
  //   onfocusout: false,
  //   onkeyup: false,
  //   onclick: false,
  //   rules: {
  //     email: {
  //       required: true,
  //       email: true,
  //     },
  //     password: {
  //       required: true,
  //       minlength: 8,
  //     },
  //   },
  //   messages: {
  //     email: {
  //       required: "Bắt buộc nhập email",
  //       email: "Nhập đúng chuẩn email",
  //     },
  //     password: {
  //       required: "Bắt buộc nhập password",
  //       minlength: "Hãy nhập ít nhất 8 ký tự",
  //     },
  //   },
  // });

  $("#btn-submit-log").click(function () {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let email_check = $("#email-s").val();
    let pass_check = $("#password-s").val();
    if (email_check === "" || !email_check.match(re)) {
      $("#email-s").css("border", "1px solid red");
      $("#email-s").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#email-s").css("border", "unset");
        $("#email-s").css("background-color", "unset");
      }, 3000);
    }
    if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
      $("#password-s").css("border", "1px solid red");
      $("#password-s").css("background-color", "rgb(255, 177, 177)");
      setTimeout(function () {
        $("#password-s").css("border", "unset");
        $("#password-s").css("background-color", "unset");
      }, 3000);
    }
  });
  $("#close-popup").click(function () {
    $("input").val("");
  });
});
