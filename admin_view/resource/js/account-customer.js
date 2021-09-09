$(document).ready(function () {
	$("#fileupload").change(function (event) {
		var x = URL.createObjectURL(event.target.files[0]);
		$("#upload-img").attr("src", x);
	});

	$("#btn-submit-pass").click(function (e) {
		const regex_phone = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

		let current_password = $("#current-password").val();
		let new_password = $("#new-password").val();
		let re_password = $("#re-password").val();

		let flag_pass_user = true;

		if (current_password == "" || current_password.length < 8) {
			$("#current-password").addClass("error-input");
			$("#current-password").attr("placeholder", "Bổ sung mật khẩu đầy đủ");
			setTimeout(function () {
				$("#current-password").removeClass("error-input");
				$("#current-password").attr("placeholder", "Bổ sung mật khẩu đầy đủ");
			}, 3000);
			flag_pass_user = false;
		}

		if (new_password === "" || new_password.length < 8) {
			$("#new-password").addClass("error-input");
			$("#new-password").attr("placeholder", "Bổ sung mật khẩu mới đầy đủ");
			setTimeout(function () {
				$("#new-password").removeClass("error-input");
				$("#new-password").attr("placeholder", "Nhập mật khẩu mới ở đây");
			}, 2500);
			flag_info_user = false;
		}

		if (re_password == "" || !new_password.match(re_password)) {
			$("#re-password").addClass("error-input");
			$("#re-password").attr("placeholder", "Bổ sung lại mật khẩu đầy đủ");
			setTimeout(function () {
				$("#re-password").removeClass("error-input");
				$("#re-password").attr("placeholder", "Bổ sung lại mật khẩu đầy đủ");
			}, 3000);
			flag_info_user = false;
		}

		if (flag_info_user === true) {
			$("#change-password").submit();
		}
	});

	$("#btn-submit-info").click(function (e) {
		const regex_phone = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

		let phone_check = $("#phone").val();
		let name_check = $("#name").val();
		let address_check = $("#address").val();

		let flag_pass_user = true;

		if (name_check == "") {
			$("#name").addClass("error-input");
			$("#address").attr("placeholder", "Bổ sung tên đầy đủ");
			setTimeout(function () {
				$("#name").removeClass("error-input");
				$("#address").attr("placeholder", "Bổ sung tên đầy đủ");
			}, 3000);
			flag_pass_user = false;
		}

		if (phone_check == "" || !phone_check.match(regex_phone)) {
			$("#phone").addClass("error-input");
			$("#address").attr("placeholder", "Bổ sung SDT đầy đủ");
			setTimeout(function () {
				$("#phone").removeClass("error-input");
				$("#address").attr("placeholder", "Bổ sung SDT đầy đủ");
			}, 3000);
			flag_pass_user = false;
		}

		if (address_check === "") {
			$("#address").addClass("error-input");
			$("#address").attr("placeholder", "Bổ sung địa chỉ đầy đủ");
			setTimeout(function () {
				$("#address").removeClass("error-input");
				$("#address").attr("placeholder", "Nhập địa chỉ ở đây");
			}, 2500);
			flag_pass_user = false;
		}

		if (flag_pass_user === true) {
			$("#change-password").submit();
		}
	});
});
