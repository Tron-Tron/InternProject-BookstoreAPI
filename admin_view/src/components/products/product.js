var productServices = new productService(localStorage.getItem("token"));
// const categoryServices = new categoryService(localStorage.getItem("token"));

function renderSelectList(mangSanPham) {
	var contentHTML = "";
	mangSanPham.map(function (item) {
		contentHTML += `
    <li class="element-category" value="${item.id}" onclick="getSubCategory(this)">
      <p>${item.CategoryName}</p>
    </li>
    `;
	});
	getEle("list-category").innerHTML = contentHTML;
}

function getListCategoryPro() {
	categoryServices
		.getAllCategoryParent()
		.then(function (result) {
			console.log(result.data.data);
			renderSelectList(result.data.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function renderSubSelectList(mangSanPham) {
	var contentHTML = "";
	mangSanPham.map(function (item) {
		contentHTML += `
    <li class="sub-element" value="${item.id}" onclick="getCategory_pro(this)">
      <p>${item.CategoryName}</p>
    </li>
    `;
	});
	getEle("sub-list-category").innerHTML = contentHTML;
}

function getSubCategory(idC) {
	categoryServices
		.layThongTinLoaiSanPhamCon(idC.value)
		.then(function (result) {
			console.log(result);
			renderSubSelectList(result.data.data);
		})
		.catch(function (err) {
			console.log(err);
		});
	var list_category = document.getElementsByClassName("element-category");
	for (let index = 0; index < list_category.length; index++) {
		if (list_category[index].classList.contains("active")) {
			// do some stuff
			list_category[index].classList.remove("active");
		}
	}
	idC.classList.add("active");
	getEle("choose-category").innerHTML = idC.children[0].innerHTML;
}

function getCategory_pro(idCS) {
	let name = getEle("choose-category").innerHTML;
	var list_subcategory = document.getElementsByClassName("sub-element");
	for (let index = 0; index < list_subcategory.length; index++) {
		if (list_subcategory[index].classList.contains("active")) {
			// do some stuff
			list_subcategory[index].classList.remove("active");
		}
	}
	idCS.classList.add("active");
	if (name.trim().search(" &gt;") == -1) {
		let Category_pro = name + " > " + idCS.children[0].innerHTML;
		getEle("choose-category").innerHTML = Category_pro;
		getEle("selected-category").value = idCS.value;
	}
}

//Them San Pham
function themSanPham() {
	let fd = new FormData();
	fd.append("ProductName", getEle("name-product").value);
	fd.append("Price", getEle("price").value);
	fd.append("Date", getcurrenDate());
	fd.append("Amount", getEle("unit").value);
	fd.append("Description", getEle("describe-product").value);
	fd.append("Remark", "true");
	fd.append("product", getEle("fileupload").files[0]);
	fd.append("Distributor", getEle("distributor").value);
	fd.append("idCategory", getEle("selected-category").value);
	fd.append("view", "0");
	fd.append("flag", "1");

	console.log(getEle("fileupload").files[0]);
	productServices
		.themSanPham(fd)
		.then((result) => {
			console.log(result);
			if (result.status === 200 || result.status === 201) {
				Swal.fire({
					icon: "success",
					title: "Thêm sản phẩm thành công!!!",
					showConfirmButton: false,
					timer: 1500,
				});
				// getListProduct();
				// let a = document.getElementsByClassName("form-control");
				// Array.from(a).forEach((item) => item.id);
				//alert("ok");
			}
		})
		.catch((error) => {
			console.log("error Product", error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Thêm sản phẩm không thành công!!!",
				footer: "<a href>Sai òi!!!</a>",
			});
			//alert("sai");
		});
}

function getcurrenDate() {
	let today = new Date();

	let date =
		today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	let time =
		today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	let dateTime = date + " " + time;

	return dateTime;
}

function getListProduct() {
	productServices
		.getProductsList()
		.then(function (result) {
			renderProductTable(result.data.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function deleteProductById(id) {
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
			text: "Sản phẩm sẽ về trạng thái đóng",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Xóa!",
			cancelButtonText: "Hủy!",
			reverseButtons: true,
		})
		.then((result) => {
			if (result.isConfirmed) {
				productServices
					.deleteProduct(id)
					.then((result) => {
						if (result.status === 200 || result.status === 201) {
							swalWithBootstrapButtons.fire(
								"Xóa thành công!",
								"Sản phẩm đã ẩn.",
								"success"
							);
							getListProduct();
						}
					})
					.catch((error) => {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "Xóa sản phẩm không thành công!!!",
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

function resetProductById(id) {
	Swal.fire({
		title: "Bạn có muốn khôi phục sản phẩm?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		cancelButtonText: "Hủy",
		confirmButtonText: "Khôi phục",
	}).then((result) => {
		if (result.isConfirmed) {
			productServices
				.resetProduct(id)
				.then((result) => {
					if (result.status === 200 || result.status === 201) {
						Swal.fire(
							"Khôi Phục Thành Công!",
							"Sản phẩm bạn đã ở trạng thái buôn bán.",
							"success"
						);
						getListProduct();
					}
				})
				.catch((error) => {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Khôi phục sản phẩm không thành công!!!",
						footer: "<a href>Sai òi!!!</a>",
					});
				});
		}
	});
}

//Sua san pham
function suaSP(idsp) {
	productServices
		.layThongTinSanPham(idsp)
		.then(function (result) {
			const date = new Date(result.data.data[0].Date);
			const day = date.getDate();
			const month = date.getMonth();
			const year = date.getFullYear();
			const formatDate = day + "-" + month + "-" + year;
			const path = "../../../resource/imgs/products/";

			localStorage.setItem("idSP", idsp);

			getEle("name-productE").value = result.data.data[0].ProductName;
			getEle("price-productE").value = result.data.data[0].Price;
			getEle("unit-productE").value = result.data.data[0].Amount;
			getEle("description-productE").value = result.data.data[0].Description;
			getEle("distributor-productE").value = result.data.data[0].Distributor;
			var pathnew = path + result.data.data[0].Image;
			getEle("upload-img-product").src = pathnew;
			// getEle("image-productE").value = result.data.data[0].Image;
			if (result.data.data[0].Remark == 1) {
				getEle("remark-true").checked = true;
			} else {
				getEle("remark-false").checked = true;
			}
			getEle("distributor-productE").value = result.data.data[0].Distributor;
			// getEle("category-productE").value = result.data.data.idCategory;
		})
		.catch(function (err) {
			console.log(err);
		});
}

// //Cap Nhat san pham
function capNhatSP(id) {
	event.preventDefault();
	let fd1 = new FormData();

	let price = getEle("price-productE").value;
	let quantity = getEle("unit-productE").value;
	let description = getEle("description-productE").value;
	let distributor = getEle("distributor-productE").value;
	let image = getEle("image-productE").files[0];
	let remark;
	var radios = document.getElementsByName("adv-product");
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			// do whatever you want with the checked radio
			remark = radios[i].value;
			// only one radio can be logically checked, don't check the rest
			break;
		}
	}

	fd1.append("Price", price);
	fd1.append("Amount", quantity);
	fd1.append("Description", description);
	fd1.append("Remark", remark);
	fd1.append("product", image);
	fd1.append("Distributor", distributor);

	console.log(fd1);
	productServices
		.capNhatSanPham(id, fd1)
		.then(function (result) {
			if (result.status === 200 || result.status === 201) {
				console.log(result);
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: "Sửa sản phẩm thành công!!!",
					showConfirmButton: false,
					timer: 1500,
				});
				getListProduct();
				// let a = document.getElementsByClassName("form-control");
				// Array.from(a).forEach((item) => (item.value = ""));
			}
		})
		.catch((error) => {
			console.log(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Sửa sản phẩm không thành công!!!",
				footer: "<a href>Sai òi!!!</a>",
			});
		});
}

// //chức năng tìm kiếm
// getEle("txtSearch2").addEventListener("keyup", function () {
//   var chuoiTimKiem = getEle("txtSearch2").value;
//   var mangSanPham = JSON.parse(localStorage.getItem("danhSachSanPham")) || [];
//   var mangTimKiem = sanPhamService.timKiemSanPham(chuoiTimKiem, mangSanPham);

//   renderProductTable(mangTimKiem);
// });

function getEle(id) {
	return document.getElementById(id);
}

function renderProductTable(mangSanPham) {
	var contentHTML = "";
	mangSanPham.map(function (item) {
		const date = new Date(item.Date);
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const formatDate = day + "-" + month + "-" + year;
		if (item.Amount == 0 && item.flag == 1) {
			contentHTML += `
            <tr class="warning">
              <td class = "id-procduct">${item.id}</td>
              <td class="name-product"><p>${item.ProductName}</p>
                <div class="img-pro" >
                  <img src="../../../resource/imgs/products/${item.Image}" alt="">
                </div>
              </td>
              <td class = "price">${item.Price}</td>
              <td><p class="date-product">${formatDate}</p></td>
              <td class = "amount">${item.Amount}</td>

              <td class="description">
                <a
                  class="test"
                  href="#"
                  data-toggle="tooltip"
                  data-placement="right"
                  title="${item.Description}">
                  ${item.Description}
                </a>
              </td>
              <td class = "remark">${item.Remark}</td>
              <td><p class="distributor">${item.Distributor}</p></td>
              <td class = "view">${item.view}</td>
              <td  class="action-btn-manager">
                <button type="button"
                data-toggle="modal"
                data-target="#edit-product" type="button" class="btn btn-success" onclick="suaSP('${item.id}')">
                  Sửa
                </button>
                <button type="button" class="btn btn-danger" onclick="deleteProductById('${item.id}')">Xóa</button>
              </td>
            </tr> `;
		} else if (item.Amount > 0 && item.flag == 1) {
			contentHTML += `
                <tr>
                  <td class = "id-procduct">${item.id}</td>
                  <td class="name-product"><p>${item.ProductName}</p>
                    <div class="img-pro" >
                      <img src="../../../resource/imgs/products/${item.Image}" alt="">
                    </div>
                  </td>
                  <td class = "price">${item.Price}</td>
                  <td><p class="date-product">${formatDate}</p></td>
                  <td class = "amount">${item.Amount}</td>

                  <td class="description">
                    <a
                      class="test"
                      href="#"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="${item.Description}">
                      ${item.Description}
                    </a>
                  </td>
                  <td class = "remark">${item.Remark}</td>
                  <td><p class="distributor">${item.Distributor}</p></td>
                  <td class = "view">${item.view}</td>
                  <td  class="action-btn-manager">
                    <button type="button"
                    data-toggle="modal"
                    data-target="#edit-product" type="button" class="btn btn-success" onclick="suaSP('${item.id}')">
                      Sửa
                    </button>
                    <button type="button" class="btn btn-danger" onclick="deleteProductById('${item.id}')">Xóa</button>
                  </td>
              </tr> `;
		} else if (item.flag == 0) {
			contentHTML += `
                <tr class="danger	">
                  <td class = "id-procduct">${item.id}</td>
                  <td class="name-product"><p>${item.ProductName}</p>
                    <div class="img-pro" >
                      <img src="../../../resource/imgs/products/${item.Image}" alt="">
                    </div>
                  </td>
                  <td class = "price">${item.Price}</td>
                  <td><p class="date-product">${formatDate}</p></td>
                  <td class = "amount">${item.Amount}</td>

                  <td class="description">
                    <a
                      class="test"
                      href="#"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="${item.Description}">
                      ${item.Description}
                    </a>
                  </td>
                  <td class = "remark">${item.Remark}</td>
                  <td><p class="distributor">${item.Distributor}</p></td>
                  <td class = "view">${item.view}</td>
                  <td  class="action-btn-manager">
                    <button type="button"
                    type="button" class="btn btn-success" onclick="resetProductById('${item.id}')">
                      Khôi Phục
                    </button>
                    
                  </td>
              </tr> `;
		}
	});
	getEle("tblDanhSachSanPham").innerHTML = contentHTML;
}
