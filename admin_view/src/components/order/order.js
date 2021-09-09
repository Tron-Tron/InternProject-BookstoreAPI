var orderServices = new orderService(localStorage.getItem("token"));
let danhSachOrder = [];
function getListOrder() {
  orderServices
    .getOrdersList()
    .then(function (result) {
      danhSachOrder = [...result.data.data];
      renderOrderTable(result.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getDetailOrders(id) {
  orderServices
    .getDetailOrder(id)
    .then(function (result) {
      console.log("detail", result.data.data);
      renderDetailOrder(result.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function renderDetailOrder(mangDetail) {
  var contentHTML = "";
  mangDetail.map(function (item) {
    item.product_orders.map(function (item_detail) {
      contentHTML += `
      <div class="row-detail">
      <div class="contain-img">
      <img src="../../../../uploads/product/${item_detail.productId.image[0]}" alt="" />
    </div>
      <p>${item_detail.productId.name}</p>
      <span>x${item_detail.amountCart}</span>
    </div>
              `;
    });
  });
  getEle("detailOrder").innerHTML = contentHTML;
}
function getCustomerOrders(id) {
  orderServices
    .getCustomerOrder(id)
    .then(function (result) {
      renderCustomerOrder(result.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function renderCustomerOrder(mangDetail) {
  var contentHTML = "";
  mangDetail.map(function (item) {
    contentHTML += `
    <div class="container-customer">
      <div class="info-customer">
        <p>
        <label for="">Tên:</label> <span>${item.CustomerName}</span>
        </p>
        <p>
        <label for="">Email:</label>  <span>${item.email}</span>
        </p>
        <p>
        <label for="">Số điện thoại:</label> <span>${item.Phone}</span>
        </p>
        <p>
        <label for="">Địa chỉ:</label>
          <span>${item.Address}</span>
        </p>
      </div>
    </div>
            `;
  });
  getEle("detailCustomer").innerHTML = contentHTML;
}

function renderOrderTable(arr = danhSachOrder) {
  var contentHTML = "";
  arr.map(function (item, index) {
    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formatDate = `${day}-${month}-${year} ${hour}:${minute}`;
    let status;
    let btnStatus;
    if (item.status === "picking") {
      status = "Chờ xác nhận";
      btnStatus = `   <button
      type="button"
      class="btn btn-info"
      data-toggle="modal"
      data-target="#edit-order"
      onclick="addKeyOrder('${item._id}')"
    >
      <i class="fas fa-wrench"></i>
    </button>`;
    } else if (item.status === "picked") {
      status = "Đã xác nhận";
      btnStatus = `   <button
      type="button"
      class="btn btn-info"
      data-toggle="modal"
      data-target="#edit-order"
      onclick="addKeyOrder('${item._id}')"
    >
      <i class="fas fa-wrench"></i>
    </button>`;
    } else if (item.status === "delivering") {
      status = "Đang giao";
      btnStatus = `   <button
      type="button"
      class="btn btn-info"
      data-toggle="modal"
      data-target="#edit-order"
      onclick="addKeyOrder('${item._id}')"
    >
      <i class="fas fa-wrench"></i>
    </button>`;
    } else if (item.status === "delivered") {
      btnStatus = `<button type="button" class="btn btn-success">
                <i class="fas fa-check-circle"></i>
                </button>`;
      status = "Đã giao";
    } else if (item.status === "canceled") {
      status = "Đã Hủy";
      btnStatus = `<button type="button" class="btn btn-danger">
      <i class="fas fa-ban"></i>
    </button>`;
    }
    const address = `${item.deliveryAddress.text},${item.deliveryAddress.ward},${item.deliveryAddress.district},${item.deliveryAddress.province}`;
    contentHTML += `
    <tr class="element-order danger">
    <td class="id-order">${index + 1}</td>
    <td class="name-order">${item.totalOrder}</td>
    <td class="ship-order">${item.ship}</td>
    <td class="date-order">${formatDate}</td>
    <td class="unit-order">
      <p>${status}</p>
    </td>
    <td class="address-order">
      <a class="test" href="#" data-toggle="tooltip" data-placement="right"
        title="${address}">${address}</a>
    </td>
    <td class="note-order">
      <a class="test" href="#" data-toggle="tooltip" data-placement="right"
        title="${item.note}">${item.note}</a>
    </td>
    <td class="img-detail">
      <!-- Button trigger modal -->
      <button type="button" class="detail-o" data-toggle="modal" data-target="#detail-order" onclick="getDetailOrders('${
        item.id
      }')">
        <img src="../../resource/imgs/Log/299-2992961_order-list-icon-png-download-order-taking-icon.png" alt="" />
      </button>
   </td>
    <td class="img-customer">
                      <button type="button" class="detail-o" data-toggle="modal" data-target="#detail-customer"
                      onclick="getCustomerOrders('${item.idCustomer}')">
                        <img src="../../resource/imgs/Log/icon_user.png" alt="" />
                      </button>
    </td>
    <td class="action-row">
   ${btnStatus}
      </td>
    </tr>
  </tr>
              `;
  });
  getEle("TBlist-order").innerHTML = contentHTML;
}

function addKeyOrder(params) {
  localStorage.setItem("idOrder", params);
}

//Cap Nhat Hóa đơn
function capNhatOrder(id) {
  //	let order = new FormData();
  let status;
  if (roleLogin === "shipper") {
    status = getEle("SL-status-ord-shipper").value;
  } else {
    status = getEle("SL-status-ord").value;
  }
  //	order.append("Status", Status);
  let data = JSON.stringify({ status });
  console.log(data);
  orderServices
    .updateOrder(id, data)
    .then(function (result) {
      if (result.status === 200 || result.status === 201) {
        Swal.fire({
          //    position: "top-end",
          icon: "success",
          title: "Cập nhật trạng thái thành công!!!",
          showConfirmButton: false,
          timer: 1500,
        });
        getListOrder();
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sửa sản phẩm không thành công!!!",
        footer: "<a href>Sai òi!!!</a>",
      });
    });
}
