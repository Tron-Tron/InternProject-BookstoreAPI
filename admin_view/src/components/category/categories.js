var categoryServices = new categoryService(localStorage.getItem("token"));
const roleLogin = JSON.parse(
  window.atob(localStorage.getItem("token").split(".")[1])
).roles;
getListCategory();

function getListCategory() {
  if (roleLogin === "admin") {
    categoryServices
      .getAllCategoryParent()
      .then(function (result) {
        // localStorage.setItem("product_category", JSON.stringify(result.data));
        console.log("a", result.data);
        renderCategoryTable(result.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    categoryServices
      .getAllCategoriesStore()
      .then(function (result) {
        // localStorage.setItem("product_category", JSON.stringify(result.data));
        renderCategoryTable(result.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

// document
//   .getElementById("btnThemLoaiSanPham")
//   .addEventListener("click", function () {
//     categoryServices
//       .getAllCategoryParent()
//       .then(function (result) {
//         renderAE_Category(result.data.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//     document.getElementById("contain-category-AE").classList.remove("hidden");
//     document.getElementById("bnt-add-category").classList.remove("hidden");
//     document.getElementById("btn-edit-category").classList.add("hidden");
//   });

// function renderAE_Category(arr) {
//   var list = getEle("list-category-AE");
//   var option = document.createElement("option");
//   option.text = "---------";
//   option.value = "";
//   list.add(option);
//   console.log("check", arr);
//   for (let index = 0; index < arr.length; index++) {
//     var option = document.createElement("option");
//     option.text = arr[index].CategoryName;
//     option.value = arr[index].id;
//     list.add(option);
//   }
// }

// document
//   .getElementById("bnt-add-category")
//   .addEventListener("click", function () {
//     themLoaiSanPham();
//   });

//Them San Pham
function themLoaiSanPham() {
  var name = getEle("name-category").value;
  // var parent = getEle("list-category-AE").value;

  var data = JSON.stringify({
    name,
    //   p_name: name,
    //  p_idParent: parent,
  });

  categoryServices
    .addCategory(data)
    .then((result) => {
      if (result.status === 200 || result.status === 201) {
        Swal.fire({
          //  position: "top-end",
          icon: "success",
          title: "Th??m th??nh c??ng",
          showConfirmButton: false,
          timer: 1500,
        });
        getListCategory();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Th??m lo???i s???n ph???m kh??ng th??nh c??ng!!!",
        footer: "<a href>Sai ??i!!!</a>",
      });
    });
}

//Ch???c n??ng X??a
function deleteCategoryById(id) {
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
      text: "Lo???i s???n ph???m s??? v??? tr???ng th??i ????ng",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "X??a!",
      cancelButtonText: "H???y!",
      reverseButtons: true,
    })
    .then((result) => {
      console.log("result", result);
      if (result.isConfirmed) {
        categoryServices
          .xoaLoaiSanPham(id)
          .then((result) => {
            let re = result.data.data[0][0][0];
            if ((result.status === 200 || result.status === 201) && re != 0) {
              swalWithBootstrapButtons.fire(
                "X??a th??nh c??ng!",
                "Lo???i s???n ph???m ???? ???n.",
                "success"
              );
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "X??a lo???i s???n ph???m kh??ng th??nh c??ng!!!",
                footer: "<a href>Sai ??i!!!</a>",
              });
            }
            getListCategory();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "X??a lo???i s???n ph???m kh??ng th??nh c??ng!!!",
              text: `${error}`,
              footer: "<a href>Sai ??i!!!</a>",
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

//Sua san pham
function suaCate(id) {
  // document.getElementById("contain-category-AE").classList.add("hidden");
  document.getElementById("modal-category").classList.add("hidden");
  document.getElementById("modal-edit-category").classList.remove("hidden");
  document.getElementById("bnt-add-category").classList.add("hidden");
  document.getElementById("btn-edit-category").classList.remove("hidden");
  localStorage.setItem("idCate", id);

  categoryServices
    .layThongTinLoaiSanPham(id)
    .then(function (result) {
      console.log("result", result);
      document.getElementById("name-category").value = result.data.data.name;
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Cap Nhat san pham
// document.getElementById("btn-edit-category").addEventListener("click", () => {
//   capNhatLSP();
// });

function capNhatLSP() {
  var name = getEle("name-category").value;
  let idCate = localStorage.getItem("idCate");
  var data = JSON.stringify({
    name,
  });
  categoryServices
    .capNhatLoaiSanPham(idCate, data)
    .then(function (result) {
      if (result.status === 200 || result.status === 201) {
        Swal.fire({
          //  position: "top-end",
          icon: "success",
          title: "Ch???nh s???a th??nh c??ng",
          showConfirmButton: false,
          timer: 1500,
        });
        getListCategory();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "S???a lo???i s???n ph???m kh??ng th??nh c??ng!!!",
        footer: "<a href>Sai ??i!!!</a>",
      });
    });
  localStorage.removeItem("idCate");
}

function renderCategoryTable(mangLoaiSanPham) {
  var contentHTML = "";
  mangLoaiSanPham.map(function (item) {
    contentHTML += `
		<li>
			<div class="content-category">
            ${
              roleLogin === "admin"
                ? `<p class="name-store-category">C???a h??ng: <span>${item.store_detail.name}</span></p>`
                : ""
            }            
				<p class="id-category">ID:<span>${item._id}</span></p>
				<p class="name-category">- <span>${item.name}</span></p>
                
				<div class="action">
					<button
					type="button"
					data-toggle="modal"
					data-target="#add-category"
					type="button"
					class="btn btn-success custom-bnt"
					onclick="suaCate('${item._id}')"
					>
					<i class="fas fa-tools"></i>
					</button>
					<button type="button" class="btn btn-danger custom-bnt" onclick="deleteCategoryById('${
            item._id
          }')">
					<i class="fas fa-trash-alt"></i>
					</button>
				</div>
				</div>
			</div>

			<ul class="sub-category">
									
			</ul>
		</li>
            `;
  });
  getEle("TBlist-category").innerHTML = contentHTML;

  // categoryServices
  //   .getAllCategorys()
  //   .then(function (result) {
  //     let list_cateParent = document.getElementById("TBlist-category");
  //     let child_list = list_cateParent.getElementsByTagName("li");
  //     for (let index = 0; index < child_list.length; index++) {
  //       let id_parent =
  //         child_list[index].children[0].children[0].children[0].innerHTML;
  //       result.data.data.forEach((element) => {
  //         if (element.parent_id == id_parent) {
  //           let node = document.createElement("li");
  //           var para = document.createTextNode(element.CategoryName);
  //           node.classList.add("mystyle");
  //           node.innerHTML = `
  // 						<div>
  // 							<p class="id-category">ID:<span>${element.id}</span></p>
  // 							<p class="name-category">- <span>${element.CategoryName}</span></p>
  // 							<div class="action">
  // 								<button
  // 								type="button"
  // 								data-toggle="modal"
  // 								data-target="#add-category"
  // 								type="button"
  // 								class="btn btn-success custom-bnt"
  // 								onclick="suaCate('${element.id}')"
  // 								>
  // 								<i class="fas fa-tools"></i>
  // 								</button>
  // 								<button type="button" class="btn btn-danger custom-bnt" onclick="deleteCategoryById('${element.id}')">
  // 								<i class="fas fa-trash-alt"></i>
  // 								</button>
  // 							</div>
  // 							</div>
  // 						</div>`;

  //           child_list[index].children[1].appendChild(node);
  //         }
  //       });
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
}
