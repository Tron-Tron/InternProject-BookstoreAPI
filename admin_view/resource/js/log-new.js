$(document).ready(function () {
  $("#btn-open-register").click(function (e) {
    $(".content-login").css("display", "none");
    $(".content-sign-up").fadeIn();
  });
  $("#btn-open-login").click(function (e) {
    $(".content-sign-up").css("display", "none");
    $(".content-login").fadeIn();
  });

  // Turn on/off pass start

  // Login
  $("#show-pass-login").click(function () {
    $("#password-login").attr("type", "text");
    $("#hide-pass-login").css("display", "unset");
  });

  $("#hide-pass-login").click(function () {
    $("#password-login").attr("type", "password");
    $("#hide-pass-login").css("display", "none");
  });

  // Register
  $("#show-pass-register").click(function () {
    $("#password-register").attr("type", "text");
    $("#repassword-register").attr("type", "text");
    $("#hide-pass-register").css("display", "unset");
  });

  $("#hide-pass-register").click(function () {
    $("#password-register").attr("type", "password");
    $("#repassword-register").attr("type", "password");
    $("#hide-pass-register").css("display", "none");
  });

  // Turn on/off pass end

  // Validate start

  //   Login form
  $("#btn-login").click(function (e) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let email_check = $("#email-login").val();
    let pass_check = $("#password-login").val();

    let flag_login = true;

    if (email_check == "" || !email_check.match(re)) {
      $("#email-login").addClass("error-input");
      setTimeout(function () {
        $("#email-login").removeClass("error-input");
      }, 3000);
      flag_login = false;
    }
    if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
      $("#password-login").addClass("error-input");
      setTimeout(function () {
        $("#password-login").removeClass("error-input");
      }, 3000);
      flag_login = false;
    }
    if (flag_login == true) {
      $("#form-login").submit();
    }
  });

  // Register form
  $("#btn-register").click(function (e) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regex_phone = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    let email_check = $("#email-register").val();
    let pass_check = $("#password-register").val();
    let repass_check = $("#repassword-register").val();
    let phone = $("#phone").val();
    let name_user = $("#name").val();
    let address = $("#address").val();

    let flag_register = true;

    
    if (email_check == "" || !email_check.match(re)) {
      $("#email-register").addClass("error-input");
      setTimeout(function () {
        $("#email-register").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }
    if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
      $("#password-register").addClass("error-input");
      setTimeout(function () {
        $("#password-register").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }
    if (!pass_check.match(repass_check)) {
      $("#repassword-register").addClass("error-input");
      setTimeout(function () {
        $("#repassword-register").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }

    if (!phone.match(regex_phone) || phone === "") {
      $("#phone").addClass("error-input");
      setTimeout(function () {
        $("#phone").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }

    if (name_user === "") {
      $("#name").addClass("error-input");
      setTimeout(function () {
        $("#name").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }

    if (address === "") {
      $("#address").addClass("error-input");
      setTimeout(function () {
        $("#address").removeClass("error-input");
      }, 3000);
      flag_register = false;
    }
    if (flag_register == true) {
      $("#form-register").submit();
    }
  });
  // Validate end
});

// input Number
function isInputNumber(evt) {
  var char = String.fromCharCode(evt.which);
  if (!/[0-9]/.test(char)) {
    evt.preventDefault();
  }
}
