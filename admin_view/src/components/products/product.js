var productServices = new productService(localStorage.getItem("token"));

//const categoryServices = new categoryService(localStorage.getItem("token"));
var formatPrice = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

//formatPrice.format(250000);
//console.log("formatter", formatPrice.format(250000));
function renderSelectList(mangSanPham) {
  var contentHTML = "";
  mangSanPham.map(function (item) {
    contentHTML += `
	<option value=${item._id} selected="selected">
	${item.name}
</option>
    `;
  });
  getEle("category-product").innerHTML = contentHTML;
}
function addCart(productId, amountCart) {
  const data = JSON.stringify({ productId, amountCart });
  cartServices
    .addCart(data)
    .then((result) => {
      console.log("resultCart", result);
      if (result.status === 200 || result.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Bạn đã thêm sản phẩm vào giỏ hàng!!!",
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
        text: "Thêm sản phẩm vào giỏ hàng thất bại!!!",
        footer: "<a href>Sai òi!!!</a>",
      });
      //alert("sai");
    });
}
function renderProductSystem(arrProduct) {
  let contentHTML = "";
  arrProduct.map(function (item) {
    let price = formatPrice.format(item.price);
    contentHTML += `<figure class="col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item">
     
                      <div class="tm-gallery-item-overlay">
                       <img src="../../../../uploads/product/${item.image[0]}" alt="Image" class="img-fluid tm-img-center" >
                      </div>
            <p class="tm-figcaption">${item.name} - ${price}</p>
            <button onclick="addCart('${item._id}','1')" class="tm-figcaption">Thêm vào giỏ hàng</button>
  </figure>`;
  });
  // console.log("item", item);
  getEle("product-system").innerHTML = contentHTML;
}
function getProductSystem() {
  productServices
    .getProductOnSystem()
    .then(function (result) {
      console.log("result", result.data.data);
      renderProductSystem(result.data.data);
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getListCategoryPro() {
  categoryServices
    .getAllCategoriesStore()
    .then(function (result) {
      console.log("lala", result.data.data);
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
var imagesReview = [];
var imagesPost = [];

function image_select() {
  var image = document.getElementById("image-product-add").files;
  for (i = 0; i < image.length; i++) {
    if (check_duplicate(image[i].name)) {
      imagesReview.push({
        name: image[i].name,
        url: URL.createObjectURL(image[i]),
        file: image[i],
      });
      imagesPost.push(image[i]);
    } else {
      alert(image[i].name + " is already added to the list");
    }
  }
  // console.log("document.getElementById('form-add-img-product')", document.getElementById('form-add-img-product'))
  // document.getElementById('form-add-img-product').reset();
  document.getElementById("image-product-add-review").innerHTML = image_show();
}

function image_show() {
  var image = "";
  imagesReview.forEach((i) => {
    image +=
      `<div class="image_container d-flex justify-content-center position-relative">
					<img src="` +
      i.url +
      `" alt="Image">
					<span class="position-absolute" onclick="delete_image(` +
      imagesReview.indexOf(i) +
      `)">&times;</span>
			  </div>`;
  });
  return image;
}
function delete_image(e) {
  imagesPost.splice(e, 1);
  imagesReview.splice(e, 1);
  document.getElementById("image-product-add-review").innerHTML = image_show();
}

function check_duplicate(name) {
  var image = true;
  if (imagesReview.length > 0) {
    for (e = 0; e < imagesReview.length; e++) {
      if (imagesReview[e].name == name) {
        image = false;
        break;
      }
    }
  }
  return image;
}
function get_image_data() {
  var form = new FormData();
  for (let index = 0; index < imagesReview.length; index++) {
    form.append("file[" + index + "]", imagesReview[index]["file"]);
  }
  return form;
}
//Them San Pham
function themSanPham() {
  let fd = new FormData();
  fd.append("name", getEle("name-product").value);
  fd.append("price", getEle("price").value);
  fd.append("amount", getEle("unit").value);
  fd.append("description", getEle("describe-product").value);
  imagesPost.map((item) => {
    fd.append("products", item);
  });
  fd.append("author", getEle("author-product").value);
  fd.append("category", getEle("category-product").value);

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
      console.log("result", result);
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
  mangSanPham.map(function (item, index) {
    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formatDate = day + "-" + month + "-" + year;
    if (item.amount === 0 && item.status === "active") {
      contentHTML += `
            <tr class="warning">
              <td class = "id-procduct">${index + 1}</td>
              <td class="name-product"><p>${item.name}</p>
                <div class="img-pro" >
                  <img src="../../../resource/imgs/products/${
                    item.image[0]
                  }" alt="">
                </div>
              </td>
              <td class = "price">${item.price}</td>
              <td><p class="date-product">${formatDate}</p></td>
              <td class = "amount">${item.amount}</td>
			  <td class = "author">${item.author}</td>
              <td class="description">
                <a
                  class="test"
                  href="#"
                  data-toggle="tooltip"
                  data-placement="right"
                  title="${item.description}">
                  ${item.description}
                </a>
              </td>
               <td class = "view">${item.view}</td>
              <td  class="action-btn-manager">
                <button type="button"
                data-toggle="modal"
                data-target="#edit-product" type="button" class="btn btn-success" onclick="suaSP('${
                  item.id
                }')">
                  Sửa
                </button>
                <button type="button" class="btn btn-danger" onclick="deleteProductById('${
                  item.id
                }')">Xóa</button>
              </td>
            </tr> `;
    } else if (item.amount > 0 && item.status === "active") {
      contentHTML += `
                <tr>
                  <td class = "id-procduct">${index + 1}</td>
                  <td class="name-product"><p>${item.name}</p>
                    <div class="img-pro" >
                      <img src="../../../resource/imgs/products/${
                        item.image[0]
                      }" alt="">
                    </div>
                  </td>
                  <td class = "price">${item.price}</td>
                  <td><p class="date-product">${formatDate}</p></td>
                  <td class = "amount">${item.amount}</td>
				  <td class = "author">${item.author}</td>
                  <td class="description">
                    <a
                      class="test"
                      href="#"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="${item.description}">
                      ${item.description}
                    </a>
                  </td>
                  <td  class="action-btn-manager">
                    <button type="button"
                    data-toggle="modal"
                    data-target="#edit-product" type="button" class="btn btn-success" onclick="suaSP('${
                      item._id
                    }')">
                      Sửa
                    </button>
                    <button type="button" class="btn btn-danger" onclick="deleteProductById('${
                      item._id
                    }')">Xóa</button>
                  </td>
              </tr> `;
    } else if (item.status == "disable") {
      contentHTML += `
                <tr class="danger	">
                  <td class = "id-procduct">${index + 1}</td>
                  <td class="name-product"><p>${item.name}</p>
                    <div class="img-pro" >
                      <img src="../../../../uploads/product/${
                        item.image[0]
                      }" alt="">
                    </div>
                  </td>
                  <td class = "price">${item.price}</td>
                  <td><p class="date-product">${formatDate}</p></td>
                  <td class = "amount">${item.amount}</td>
				  <td class = "author">${item.author}</td>
                  <td class="description">
                    <a
                      class="test"
                      href="#"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="${item.description}">
                      ${item.description}
                    </a>
                  </td>
                  <td  class="action-btn-manager">
                    <button type="button"
                    type="button" class="btn btn-success" onclick="resetProductById('${
                      item._id
                    }')">
                      Khôi Phục
                    </button>
                    
                  </td>
              </tr> `;
    }
  });
  getEle("tblDanhSachSanPham").innerHTML = contentHTML;
}
