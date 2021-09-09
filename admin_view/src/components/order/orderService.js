// headers: {
//   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyb250cm9uQGdtYWlsLmNvbSIsImlkUm9sZSI6ImFkbWluIiwiaWF0IjoxNjIwNDQ0MjM4fQ.tJvGAbyNXlM6ozvW0YnXYx42le2HNsSI8__fHdK8CVY'
// }
// };
// export const fetchDataOrder = function (data) {
//   return axios({
//     method: "GET",
//     url: "http://localhost:5000/api/v1/order",
//     data,
//   });
// };

function orderService(token) {
  this.getOrdersList = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/order/store/all",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.deleteOrder = function (id) {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/api/v1/order/${id}`,
    });
  };

  this.getDetailOrder = function (id) {
    return axios({
      method: "GET",
      url: `http://localhost:3000/api/order/store/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  this.getCustomerOrder = function (id) {
    return axios({
      method: "GET",
      url: `http://localhost:3000/api/order/customer/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  this.updateOrder = function (id, data) {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/api/order/store/${id}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.timKiemSanPham = function (chuoiTimKiem, mangSanPham) {
    /**
     * 1. tao mang rong mangTimKiem
     * 2. duyet mangNguoiDung
     * 3. sd hàm indexOf so sánh
     * 4. thêm người dùng tìm thấy vào mảng mangTimKiem
     */
    //Cach 1
    // var mangTimKiem = [];

    // mangNguoiDung.map(function(item) {
    //   if (item.hoTen.toLowerCase().indexOf(chuoiTimKiem.toLowerCase()) > -1) {
    //     mangTimKiem.push(item);
    //   }
    // });

    // return mangTimKiem;

    //Cach 2 dung filter
    return mangSanPham.filter(function (item) {
      return (
        item.category.toLowerCase().indexOf(chuoiTimKiem.toLowerCase()) > -1 ||
        item.name_product.toLowerCase().indexOf(chuoiTimKiem.toLowerCase()) >
          -1 ||
        item.sku.toLowerCase().indexOf(chuoiTimKiem.toLowerCase()) > -1
      );
    });
  };
}
