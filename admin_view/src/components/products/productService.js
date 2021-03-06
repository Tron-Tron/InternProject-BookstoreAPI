function productService(token) {
  this.getProductOnSystem = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/product/system/all",
      headers: {
        "Content-Type": "multipart/form-data",
        //     Authorization: `Bearer ${token}`,
      },
    });
  };
  this.themSanPham = function (fd) {
    console.log("them san pham", fd);
    return axios({
      method: "POST",
      url: "http://localhost:3000/api/product/store/",
      data: fd,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  this.getProductsList = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/product/store/all",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.deleteProduct = function (id) {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/api/product/store/${id}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.layThongTinSanPham = function (id) {
    return axios({
      method: "GET",
      url: `http://localhost:3000/api/product/store/${id}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.capNhatSanPham = function (id, sanPham) {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/api/product/store/${id}`,
      data: sanPham,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  this.resetProduct = function (id) {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/api/product/store/reset/${id}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  this.timKiemSanPham = function (chuoiTimKiem, mangSanPham) {
    /**
     * 1. tao mang rong mangTimKiem
     * 2. duyet mangNguoiDung
     * 3. sd h??m indexOf so s??nh
     * 4. th??m ng?????i d??ng t??m th???y v??o m???ng mangTimKiem
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
