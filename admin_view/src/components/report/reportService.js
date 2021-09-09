function reportService(token) {
	this.getReport = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/notifi/report",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};
	this.getNotifi = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/notifi/",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};
	this.getTotalOfMonth = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/notifi/month",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};
	this.getTotalOfWeek = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/notifi/week",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};
}
