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
          title: "Th??m nh??n vi??n th??nh c??ng!!!",
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
        text: "Th??m nh??n vi??n kh??ng th??nh c??ng!!!",
        footer: "<a href>Sai ??i!!!</a>",
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
      title: "B???n c?? mu???n x??a??",
      text: "Nh??n vi??n s??? v??? tr???ng th??i ????ng",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "X??a!",
      cancelButtonText: "H???y!",
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
                title: "X??a th??nh c??ng~~",
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
              text: `X??a kh??ng th??nh c??ng!`,
              footer: "B???n kh??ng ph???i ch??? c???a h??ng",
            });
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire("???? H???y");
      }
    });
}

function resetStaffById(id) {
  Swal.fire({
    title: "B???n c?? mu???n kh??i ph???c t??i kho???n?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "H???y",
    confirmButtonText: "Kh??i ph???c",
  }).then((result) => {
    if (result.isConfirmed) {
      staffServices
        .resetAccount(id)
        .then((result) => {
          if (result.status === 200 || result.status === 201) {
            Swal.fire(
              "Kh??i Ph???c Th??nh C??ng!",
              "T??i kho???n b???n ???? ??? tr???ng th??i m???.",
              "success"
            );
            getListStaff();
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Kh??i ph???c t??i kho???n kh??ng th??nh c??ng!!! ${error}`,
            footer: "<a href>Sai ??i!!!</a>",
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
      position = "Qu???n l??";
    } else if (roles === "shipper") {
      position = "Nh??n vi??n giao h??ng";
    } else if (roles === "officer") {
      position = "Nh??n vi??n v??n ph??ng";
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
					<label for="">?????a ch???:</label> <span class="address-employee" >${item.normalizedAddress}</span>
				</p>
                <p>
					<label for="">V??? tr?? c??ng vi???c:</label> <span class="role-employee" >${position}</span>
				</p>
				<button
					type="button"
					data-toggle="modal"
					data-target="#edit-emloyees"
					type="button"
					class="btn btn-success"
					onclick="suaE('${item._id}')"
				>
					S???a
				</button>
				<button
					type="button"
					class="btn btn-danger"
					onclick="deleteStaffById('${item._id}')"
				>
					X??a
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
                <label for="">?????a ch???:</label> <span class="address-employee" >${item.normalizedAddress}</span>
            </p>
            <p>
            <label for="">V??? tr?? c??ng vi???c:</label> <span class="role-employee" >${position}</span>
        </p>
				<button
					type="button"
					type="button"
					class="btn btn-success"
					onclick="resetStaffById('${item.email}')"
				>
					Kh??i ph???c
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
            title: "S???a nh??n vi??n th??nh c??ng!!!",
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
          text: "S???a nh??n vi??n kh??ng th??nh c??ng!!!",
          footer: "<a href>Sai ??i!!!</a>",
        });
      });
    localStorage.removeItem("idE");
  });
