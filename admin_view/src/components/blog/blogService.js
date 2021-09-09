function blogService(token) {
	this.addBlog = function (blog) {
		return axios({
			method: "POST",
			url: "http://localhost:5000/api/v1/blog/",
			data: blog,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	this.getBlogList = function () {
		return axios({
			method: "GET",
			url: "http://localhost:5000/api/v1/blog",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	this.deleteBlog = function (id) {
		return axios({
			method: "DELETE",
			url: `http://localhost:5000/api/v1/blog/${id}`,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.getBlogById = function (id) {
		return axios({
			method: "GET",
			url: `http://localhost:5000/api/v1/blog/${id}`,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};

	this.updateBlogById = function (id, blog) {
		return axios({
			method: "PATCH",
			url: `http://localhost:5000/api/v1/blog/${id}`,
			data: blog,
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});
	};
}
