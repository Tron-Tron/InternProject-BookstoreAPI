function customerService(token) {
	this.getCustomersList = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/customer/",
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.deleteCustomer = function (id, email) {
		const data = JSON.stringify({
			email: email,
		});
		return axios({
			method: "DELETE",
			url: `http://localhost:5000/api/v1/customer/${id}`,
			data: data,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.resetAccount = function (email) {
		const data = JSON.stringify({
			email: email,
		});
		return axios({
			method: "PATCH",
			url: `http://localhost:5000/api/v1/auth/reset/`,
			data: data,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
		});
	}

	this.updateCustomerById = function (id, sanPham) {
		return axios({
			method: "PATCH",
			url: `http://localhost:5000/api/v1/customer/${id}`,
			data: sanPham,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};
}
