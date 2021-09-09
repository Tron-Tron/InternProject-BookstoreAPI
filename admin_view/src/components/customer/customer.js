var customerServices = new customerService(localStorage.getItem("token"));
getListCustomer();
function getListCustomer() {
	customerServices
		.getCustomersList()
		.then(function (result) {
			console.log(result.data.data);
			renderCustomerTable(result.data.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}

// function getListCustomerIdById(id) {
// 	customerServices
// 		.getCustomerById(id)
// 		.then(function (result) {
// 			getEle("name-productE").value = result.data.data[0].ProductName;
// 			getEle("price-productE").value = result.data.data[0].Price;
// 			getEle("unit-productE").value = result.data.data[0].Amount;
// 			getEle("description-productE").value = result.data.data[0].Description;
// 			getEle("distributor-productE").value = result.data.data[0].Distributor;
// 			var pathnew = path + result.data.data[0].Image;
// 			getEle("img-outP").src = pathnew;
// 			// getEle("image-productE").value = result.data.data[0].Image;
// 			if (result.data.data[0].Remark == 1) {
// 				getEle("remark-true").checked = true;
// 			} else {
// 				getEle("remark-false").checked = true;
// 			}
// 			getEle("distributor-productE").value = result.data.data[0].Distributor;
// 			// getEle("category-productE").value = result.data.data.idCategory;
// 		})
// 		.catch(function (err) {
// 			console.log(err);
// 		});
// }

// // //Cap Nhat san pham
// function updateCustomer(id) {
// 	let fd1 = new FormData();

// 	let price = getEle("price-productE").value;
// 	let quantity = getEle("unit-productE").value;
// 	let description = getEle("description-productE").value;
// 	let distributor = getEle("distributor-productE").value;
// 	let image = getEle("image-productE").files[0];
// 	let remark;
// 	var radios = document.getElementsByName("adv-product");
// 	for (var i = 0; i < radios.length; i++) {
// 		if (radios[i].checked) {
// 			// do whatever you want with the checked radio
// 			remark = radios[i].value;
// 			// only one radio can be logically checked, don't check the rest
// 			break;
// 		}
// 	}

// 	fd1.append("Price", price);
// 	fd1.append("Amount", quantity);
// 	fd1.append("Description", description);
// 	fd1.append("Remark", remark);
// 	fd1.append("product", image);
// 	fd1.append("Distributor", distributor);

// 	console.log(fd1);
// 	customerServices
// 		.capNhatSanPham(id, fd1)
// 		.then(function (result) {
// 			if (result.status === 200 || result.status === 201) {
// 				console.log(result);
// 				Swal.fire({
// 					position: "top-end",
// 					icon: "success",
// 					title: "Sửa sản phẩm thành công!!!",
// 					showConfirmButton: false,
// 					timer: 1500,
// 				});
// 				// getListProduct();
// 				// let a = document.getElementsByClassName("form-control");
// 				// Array.from(a).forEach((item) => (item.value = ""));
// 			}
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 			Swal.fire({
// 				icon: "error",
// 				title: "Oops...",
// 				text: "Sửa sản phẩm không thành công!!!",
// 				footer: "<a href>Sai òi!!!</a>",
// 			});
// 		});
// }
function deleteCustomerById(id, email) {
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
			text: "Khách hàng sẽ về trạng thái đóng",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Xóa!",
			cancelButtonText: "Hủy!",
			reverseButtons: true,
		})
		.then((result) => {
			if (result.isConfirmed) {
				customerServices
					.deleteCustomer(id, email)
					.then((result) => {
						if (result.status === 200 || result.status === 201) {
							Swal.fire({
								icon: "success",
								title: "Xóa thành công~~",
								showConfirmButton: false,
								timer: 1500,
							});
							getListCustomer();
						}
					})
					.catch((error) => {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: `Xóa không thành công! ${error}`,
							footer: "<a href>Sai òi!!!</a>",
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

function resetCustomerById(id) {
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
			customerServices
				.resetAccount(id)
				.then((result) => {
					if (result.status === 200 || result.status === 201) {
						Swal.fire(
							"Khôi Phục Thành Công!",
							"Tài khoản bạn đã ở trạng thái mở.",
							"success"
						);
						getListCustomer();
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

function renderCustomerTable(customerArr) {
	var contentHTML = "";
	customerArr.map(function (item) {
		if (item.flag == 1) {
			contentHTML += `
        <tr class="element-customer">
        <td class="id-customer">
            <p>
            ${item.id}
            </p>
        </td>
        <td class="name-customer">
            <p>
            ${item.CustomerName}
            </p>
        </td>
        <td class="address-customer">
            <p>
            ${item.Address}
            </p>
        </td>
        <td class="phone-customer">
            <p>
            ${item.Phone}
            </p>
        </td>
        <td class="img-customer"><img src="../../../resource/imgs/user/${item.image}}"
                alt="" /></td>
        <td class="email-customer">
            <p>
            ${item.email}
            </p>
        </td>
        <td>
        <button type="button" class="btn btn-danger"
        onclick="deleteCustomerById('${item.id}','${item.email}')">
        Xóa
    </button>
 
        </td>
    </tr>`;
		} else {
			contentHTML += `
        <tr class="element-customer">
        <td class="id-customer">
            <p>
            ${item.id}
            </p>
        </td>
        <td class="name-customer">
            <p>
            ${item.CustomerName}
            </p>
        </td>
        <td class="address-customer">
            <p>
            ${item.Address}
            </p>
        </td>
        <td class="phone-customer">
            <p>
            ${item.Phone}
            </p>
        </td>
        <td class="img-customer"><img src="../../../resource/imgs/user/${item.image}}"
                alt="" /></td>
        <td class="email-customer">
            <p>
            ${item.email}
            </p>
        </td>
        <td>
        <button type="button" class="btn btn-success"
        onclick="resetCustomerById('${item.email}')">
        Khôi phục
    </button>
 
        </td>
    </tr>`;
		}
	});
	getEle("TB-list-customer").innerHTML = contentHTML;
}
