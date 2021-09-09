import request from "./accountService.js";
//create object request để callAPI
let callApi = new request();
let getEle = function (value) {
  return document.getElementById(value);
};

// handle event submit
getEle("form-login").addEventListener("submit", function (event) {
  localStorage.clear();
  event.preventDefault(); // để ko load lại trang
  const email = getEle("email-login").value;
  const password = getEle("password-login").value;
  console.log("password", password);
  console.log("email", email);
  callApi
    .login({ email, password })
    .then((res) => {
      console.log(res.data.data);
      const jwtData = JSON.parse(window.atob(res.data.data.split(".")[1]));
      console.log(jwtData);
      if (jwtData.roles !== "customer") {
        localStorage.setItem("token", res.data.data);
        //      localStorage.setItem("user", JSON.stringify(res.data.data));
        Swal.fire({
          timer: 4000,
          icon: "success",
          title: "Đăng nhập thành công!!!",
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = "/admin_view/views/admin/admin-start.html";
        }, 2500);
      } else {
        localStorage.setItem("token", res.data.data);
        Swal.fire({
          timer: 4000,
          icon: "success",
          title: "Đăng nhập thành công!!!",
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.href = "/Book/index.html";
        }, 2500);
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Bạn không phải quản trị viên",
        //   footer: "<a href>Why do I have this issue?</a>",
        // });
      }
    })
    .catch((e) => {
      console.log("err", e);
      Swal.fire({
        icon: "error",
        title: "Đăng nhập không thành công",
      });
    });
});
