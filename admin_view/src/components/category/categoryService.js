function categoryService(token) {
  this.addCategory = function (themLoaiSanPham) {
    return axios({
      method: "POST",
      url: "http://localhost:3000/api/category/store/",
      data: themLoaiSanPham,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  this.getAllCategoryParent = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/category/admin/all",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  this.getAllCategoriesStore = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/category/store/all",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.xoaLoaiSanPham = function (id) {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/api/category/store/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.layThongTinLoaiSanPham = function (id) {
    console.log("vao khong, id", id);
    return axios({
      method: "GET",
      url: `http://localhost:3000/api/category/store/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.layThongTinLoaiSanPhamCon = function (id) {
    return axios({
      method: "GET",
      url: `http://localhost:5000/api/v1/category/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.layTenLoaiSanPham = function (name) {
    return axios({
      method: "GET",
      url: `http://localhost:5000/api/v1/category/name`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.capNhatLoaiSanPham = function (id, sanPham) {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/api/category/store/${id}`,
      data: sanPham,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  this.timKiemSanPham = function (chuoiTimKiem, mangLoaiSanPham) {
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
    return mangLoaiSanPham.filter(function (item) {
      return item.name.toLowerCase().indexOf(chuoiTimKiem.toLowerCase()) > -1;
    });
  };
}
