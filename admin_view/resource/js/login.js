$(document).ready(function() {
    let flag_capcha;
    gen_capcha();
    $("#slideup").click(function() {
        $("#forgot").addClass("hide");
        $(".sign-in-container").fadeIn();
        $("input").val("");
        gen_capcha();
    });
    $("#slidedown").click(function() {
        $(".sign-in-container").css("display", "none");
        $("#forgot").removeClass("hide");
        $("#forgot").fadeIn();
    });

    $("#btn-log-in").click(function(e) {
        const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email_check = $(
            "#sign-in-container .account-input input[type=email]"
        ).val();
        let pass_check = $(
            "#sign-in-container .account-input input[type=password]"
        ).val();

        let flag = true;

        if (email_check === "" || !email_check.match(email)) {
            $("#sign-in-container .account-input input[type=email]").addClass(
                "error-input"
            );
            $("#sign-in-container .account-input input[type=email]").attr(
                "placeholder",
                "Bổ sung email đầy đủ"
            );
            setTimeout(function() {
                $("#sign-in-container .account-input input[type=email]").removeClass(
                    "error-input"
                );
                $("#sign-in-container .account-input input[type=email]").attr(
                    "placeholder",
                    "Nhập email ở đây"
                );
                $("#sign-in-container .account-input input[type=email]").val("");
            }, 2500);
            flag = false;
        }

        if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
            $("#sign-in-container .account-input input[type=password]").addClass(
                "error-input"
            );
            $("#sign-in-container .account-input input[type=password]").attr(
                "placeholder",
                "Bổ sung password đầy đủ"
            );
            setTimeout(function() {
                $("#sign-in-container .account-input input[type=password]").removeClass(
                    "error-input"
                );
                $("#sign-in-container .account-input input[type=password]").attr(
                    "placeholder",
                    "Nhập password ở đây"
                );
                $("#sign-in-container .account-input input[type=password]").val("");
            }, 2500);
            flag = false;
        }

        if ($("#txtInput").val() != flag_capcha) {
            gen_capcha();
            flag = false;
        }

        if (flag == true) {
            $("#sign-in-container").submit();
        }
    });

    $(".nav-tabs li").click(function(e) {
        $("input").val("");
        gen_capcha();
        gen_capcha1();
    });

    $("#btn-sign-up").click(function(e) {
        const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regex_phone = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

        let email_check = $("#email").val();
        let pass_check = $("#pass").val();
        let repass_check = $("#repass").val();
        let name_check = $("#name").val();
        let phone_check = $("#phone").val();

        if (name_check === "") {
            $("#name").addClass("error-input");
            $("#name").attr("placeholder", "Bổ sung password đầy đủ");
            setTimeout(function() {
                $("#name").removeClass("error-input");
                $("#name").attr("placeholder", "Nhập tên ở đây");
                $("#name").val("");
            }, 2500);
            flag = false;
        }

        if (phone_check === "" || !phone_check.match(regex_phone)) {
            $("#phone").addClass("error-input");
            $("#phone").attr("placeholder", "Bổ sung email đầy đủ");
            setTimeout(function() {
                $("#phone").removeClass("error-input");
                $("#phone").attr("placeholder", "Nhập phone ở đây");
                $("#phone").val("");
            }, 2500);
            flag = false;
        }
        if (email_check === "" || !email_check.match(email)) {
            $("#email").addClass("error-input");
            $("#email").attr("placeholder", "Bổ sung email đầy đủ");
            setTimeout(function() {
                $("#email").removeClass("error-input");
                $("#email").attr("placeholder", "Nhập email ở đây");
                $("#email").val("");
            }, 2500);
            flag = false;
        }

        if (pass_check === "" || pass_check.length < 8 || pass_check.length > 16) {
            $("#pass").addClass("error-input");
            $("#pass").attr("placeholder", "Bổ sung password đầy đủ");
            setTimeout(function() {
                $("#pass").removeClass("error-input");
                $("#pass").attr("placeholder", "Nhập password ở đây");
                $("#pass").val("");
            }, 2500);
            flag = false;
        }

        if (!pass_check.match(repass_check)) {
            $("#repass").addClass("error-input");
            $("#repass").attr("placeholder", "Bổ sung password đầy đủ");
            setTimeout(function() {
                $("#repass").removeClass("error-input");
                $("#repass").attr("placeholder", "Nhập repassword ở đây");
                $("#repass").val("");
            }, 2500);
            flag = false;
        }

        if ($("#txtInput1").val() != flag_capcha) {
            gen_capcha1();
            flag = false;
        }

        if (flag == true) {
            $("#sign-in-container").submit();
        }
    });

    function gen_capcha() {
        let iNumber = Math.floor(Math.random() * 10000);
        $("#divGenerateRandomValues").css({
            "background-image": "url(../imgs/Log/bg6.png)",
            width: "100px",
            height: "50px",
        });
        $("#divGenerateRandomValues").html(
            "<input id='txtNewInput' readonly></input>"
        );
        $("#txtNewInput").css({
            background: "transparent",
            "font-family": "Arial",
            "font-style": "bold",
            "font-size": "40px",
        });
        $("#txtNewInput").css({
            width: "100px",
            border: "none",
            color: "black",
        });
        $("#txtNewInput").val(iNumber);
        flag_capcha = iNumber;
    }

    function gen_capcha1() {
        let iNumber = Math.floor(Math.random() * 10000);
        $("#divGenerateRandomValues1").css({
            "background-image": "url(../imgs/Log/bg6.png)",
            width: "100px",
            height: "50px",
        });
        $("#divGenerateRandomValues1").html(
            "<input id='txtNewInput1' readonly></input>"
        );
        $("#txtNewInput1").css({
            background: "transparent",
            "font-family": "Arial",
            "font-style": "bold",
            "font-size": "40px",
        });
        $("#txtNewInput1").css({
            width: "100px",
            border: "none",
            color: "black",
        });
        $("#txtNewInput1").val(iNumber);
        flag_capcha = iNumber;
    }
});