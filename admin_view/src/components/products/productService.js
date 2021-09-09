function productService(token) {
	this.themSanPham = function (themSanPham) {
		return axios({
			method: "POST",
			url: "http://localhost:5000/api/v1/product/",
			data: themSanPham,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	this.getProductsList = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/product",
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.deleteProduct = function (id) {
		return axios({
			method: "DELETE",
			url: `http://localhost:5000/api/v1/product/${id}`,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.layThongTinSanPham = function (id) {
		return axios({
			method: "GET",
			url: `http://localhost:5000/api/v1/product/${id}`,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.capNhatSanPham = function (id, sanPham) {
		return axios({
			method: "PATCH",
			url: `http://localhost:5000/api/v1/product/${id}`,
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
			url: `http://localhost:5000/api/v1/product/reset/${id}`,
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
