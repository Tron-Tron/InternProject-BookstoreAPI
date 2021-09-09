var staffServices = new staffService(localStorage.getItem("token"));

getListStaff();

function getListStaff() {
  staffServices
    .getStaffsList()
    .then(function (result) {
      renderStaffTable(result.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getEle(id) {
  return document.getElementById(id);
}

// function createNewStaff() {
// 	let fdStaff = new FormData();
// 	fdStaff.append("p_email", getEle("email-employee").value);
// 	fdStaff.append("p_password", getEle("curren-password").value);
// 	fdStaff.append("p_name", getEle("name-employee").value);
// 	fdStaff.append("p_phone", getEle("phone-employee").value);
// 	fdStaff.append("p_image", getEle("fileupload-employee").files[0]);
// 	fdStaff.append("p_address", getEle("address-employee").value);

// 	console.log("p_password", getEle("curren-password").value);
// 	console.log("p_email", getEle("email-employee").value);
// 	console.log("p_name", getEle("name-employee").value);
// 	console.log("p_phone", getEle("phone-employee").value);
// 	console.log("p_image", getEle("fileupload-employee").files[0]);
// 	console.log("p_address", getEle("address-employee").value);
// 	const config = {
// 		method: "POST",
// 		url: "http://localhost:5000/api/v1/staff/",
// 		data: fdStaff,
// 		headers: {
// 			Authorization: `Bearer ${localStorage.getItem("token")}`,
// 			"Content-Type": "multipart/form-data",

// 		},
// 	}
// 	axios(config)
// 	.then(function (response) {
// 		console.log(response);
// 	  console.log(JSON.stringify(response.data));
// 	})
// 	.catch(function (error) {
// 	  console.log(error);
// 	});

// }

function createNewStaff() {
  const email = getEle("email-employee").value;
  // fdStaff.append("p_password", getEle("curren-password").value);
  const staff_name = getEle("name-employee").value;
  const province = getEle("province-employee").value;
  const district = getEle("district-employee").value;
  const ward = getEle("ward-employee").value;
  const text = getEle("text-employee").value;
  const roles = getEle("role-employee").value;
  const data = JSON.stringify({
    email,
    staff_name,
    province,
    district,
    ward,
    text,
    roles,
  });
  staffServices
    .addNewStaff(data)
    .then((result) => {
      if (typeof result !== "undefined") {
        Swal.fire({
          icon: "success",
          title: "Thêm nhân viên thành công!!!",
          showConfirmButton: false,
          timer: 5500,
        });
      }
    })
    .catch((error) => {
      console.log("error Product", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Thêm nhân viên không thành công!!!",
        footer: "<a href>Sai òi!!!</a>",
      });
    });
}

//Sua san pham
function suaE(idE) {
  staffServices
    .getStaffById(idE)
    .then(function (result) {
      localStorage.setItem("idE", idE);
      getEle("email-employeeE").value = result.data.data.email;
      getEle("name-employeeE").value = result.data.data.staff_name;
      //    getEle("phone-employeeE").value = result.data.data[0].Phone;
      getEle("province-employeeE").value = result.data.data.address.province;
      getEle("district-employeeE").value = result.data.data.address.district;
      getEle("ward-employeeE").value = result.data.data.address.ward;
      getEle("text-employeeE").value = result.data.data.address.text;
    })
    .catch(function (err) {
      console.log(err);
    });
}

function deleteStaffById(id) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger cus-alert",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Bạn có muốn xóa??",
      text: "Nhân viên sẽ về trạng thái đóng",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa!",
      cancelButtonText: "Hủy!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        staffServices
          .deleteStaffById(id)
          .then((result) => {
            if (result.status === 200 || result.status === 201) {
              Swal.fire({
                icon: "success",
                title: "Xóa thành công~~",
                showConfirmButton: false,
                timer: 1500,
              });
              getListStaff();
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Xóa không thành công!`,
              footer: "Bạn không phải chủ cửa hàng",
            });
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire("Đã Hủy");
      }
    });
}

function resetStaffById(id) {
  Swal.fire({
    title: "Bạn có muốn khôi phục tài khoản?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Hủy",
    confirmButtonText: "Khôi phục",
  }).then((result) => {
    if (result.isConfirmed) {
      staffServices
        .resetAccount(id)
        .then((result) => {
          if (result.status === 200 || result.status === 201) {
            Swal.fire(
              "Khôi Phục Thành Công!",
              "Tài khoản bạn đã ở trạng thái mở.",
              "success"
            );
            getListStaff();
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Khôi phục tài khoản không thành công!!! ${error}`,
            footer: "<a href>Sai òi!!!</a>",
          });
        });
    }
  });
}

function renderStaffTable(staffArr) {
  var contentHTML = "";
  staffArr.map(function (item) {
    let roles = item.account_detail.roles;
    let position;
    if (roles === "manager") {
      position = "Quản lý";
    } else if (roles === "shipper") {
      position = "Nhân viên giao hàng";
    } else if (roles === "officer") {
      position = "Nhân viên văn phòng";
    }
    if (item.status == "active") {
      contentHTML += `
		<div class="media">
			<div class="media-body">
				<h4 class="media-heading">${item.staff_name}</h4>
				<p>
					<label for="">ID:</label> <span>${item._id}</span>
				</p>
				<p>
					<label for="">Email:</label> <span>${item.email}</span>
				</p>
				<p>
					<label for="">Địa chỉ:</label> <span class="address-employee" >${item.normalizedAddress}</span>
				</p>
                <p>
					<label for="">Vị trí công việc:</label> <span class="role-employee" >${position}</span>
				</p>
				<button
					type="button"
					data-toggle="modal"
					data-target="#edit-emloyees"
					type="button"
					class="btn btn-success"
					onclick="suaE('${item._id}')"
				>
					Sửa
				</button>
				<button
					type="button"
					class="btn btn-danger"
					onclick="deleteStaffById('${item._id}')"
				>
					Xóa
				</button>
			</div>
		</div>
        `;
    } else {
      contentHTML += `
		<div class="media">
			<div class="media-body">
            <h4 class="media-heading">${item.staff_name}</h4>
            <p>
                <label for="">ID:</label> <span>${item._id}</span>
            </p>
            <p>
                <label for="">Email:</label> <span>${item.email}</span>
            </p>
            <p>
                <label for="">Địa chỉ:</label> <span class="address-employee" >${item.normalizedAddress}</span>
            </p>
            <p>
            <label for="">Vị trí công việc:</label> <span class="role-employee" >${position}</span>
        </p>
				<button
					type="button"
					type="button"
					class="btn btn-success"
					onclick="resetStaffById('${item.email}')"
				>
					Khôi phục
				</button>
			</div>
		</div>
        `;
    }
  });
  getEle("TB-list-employees").innerHTML = contentHTML;
}

document
  .getElementById("btn-employeeEdit")
  .addEventListener("click", function () {
    const email = getEle("email-employeeE").value;
    // fdStaff.append("p_password", getEle("curren-password").value);
    const staff_name = getEle("name-employeeE").value;
    const province = getEle("province-employeeE").value;
    const district = getEle("district-employeeE").value;
    const ward = getEle("ward-employeeE").value;
    const text = getEle("text-employeeE").value;
    let id = localStorage.getItem("idE");
    const edit_temp = JSON.stringify({
      email,
      staff_name,
      province,
      district,
      ward,
      text,
    });
    staffServices
      .updateStaffById(id, edit_temp)
      .then(function (result) {
        if (result.status === 200 || result.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Sửa nhân viên thành công!!!",
            showConfirmButton: false,
            timer: 1500,
          });
          getListStaff();
          // let a = document.getElementsByClassName("form-control");
          // Array.from(a).forEach((item) => (item.value = ""));
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sửa nhân viên không thành công!!!",
          footer: "<a href>Sai òi!!!</a>",
        });
      });
    localStorage.removeItem("idE");
  });
