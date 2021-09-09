var blogServices = new blogService(localStorage.getItem("token"));

// Lấy danh sách slide
function getListBlog() {
	blogServices
		.getBlogList()
		.then(function (result) {
			// localStorage.setItem("table-product", JSON.stringify(result.data.data));
			renderBlogTable(result.data.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function renderBlogTable(mangSanPham) {
	var contentHTML = "";
	mangSanPham.map(function (item) {
		const date = new Date(item.date);
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const formatDate = day + "/" + month + "/" + year;
		contentHTML += `
        <tr class="element-blog">
            <td class="id-blog">${item.id}</td>
            <td class="title-blog"><p>${item.titleBlog}</p></td>
            <td class="content-blog"><p>${item.contentBlog}</p></td>
            <td class="date-blog"><p>${formatDate}</p></td>
            <td class="img-blog"><img
            src="../../../resource/imgs/blog/${item.image}"
            alt=""/></td>
            <td class="unit-blog">
                <button
                type="button"
                data-toggle="modal"
                data-target="#edit-blog"
                type="button"
                class="btn btn-success custom-bnt"
                onclick="suaBlog('${item.id}')"
                >
                Sửa
                </button>
                    <button type="button" class="btn btn-danger custom-bnt" onclick="deleteBlogById('${item.id}')">
                Xóa
                </button>
            </td>
        </tr>
        `;
	});
	getEle("TB-list-blog").innerHTML = contentHTML;
}

function getEle(id) {
	return document.getElementById(id);
}

// Thêm silde
function themBlog() {
	let fd = new FormData();
	fd.append("title", getEle("name-blog").value);
	fd.append("content", getEle("content-blog").value);
	fd.append("blog", getEle("fileupload").files[0]);
	blogServices
		.addBlog(fd)
		.then((result) => {
			console.log(result);
			if (result.status === 200 || result.status === 201) {
				Swal.fire({
					icon: "success",
					title: "Thêm Blog thành công!!!",
					showConfirmButton: false,
					timer: 3000,
				});
			}
		})
		.catch((error) => {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Thêm Blog không thành công!!!",
			});
		});
}

function deleteBlogById(id) {
	Swal.fire({
		title: "Bạn có muốn xóa chứ?",
		showDenyButton: true,
		confirmButtonText: `Không`,
		denyButtonText: `Xóa`,
	}).then((result) => {
		/* Read more about isConfirmed, isDenied below */
		if (result.isConfirmed) {
			Swal.fire("Hủy thao tác", "", "info");
		} else if (result.isDenied) {
			blogServices
				.deleteBlog(id)
				.then((result) => {
					if (result.status === 200 || result.status === 201) {
						getListBlog();
						Swal.fire({
							icon: "success",
							title: "Xóa side thành công!!!",
							showConfirmButton: false,
							timer: 1500,
						});
					}
				})
				.catch((error) => {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Xóa slide không thành công!!!",
						footer: "<a href>Sai òi!!!</a>",
					});
				});
		}
	});
}

function suaBlog(idBlog) {
	blogServices
		.getBlogById(idBlog)
		.then(function (result) {
			const path = "../../../resource/imgs/blog/";

			localStorage.setItem("idBlog", idBlog);

			console.log(result.data.data[0]);
			var pathnew = path + result.data.data[0].image;
			getEle("upload-img-blog").src = pathnew;
			getEle("title-blog").value = result.data.data[0].titleBlog;
			getEle("content-blog").value = result.data.data[0].contentBlog;
			// getEle("image-productE").value = result.data.data[0].Image;
		})
		.catch(function (err) {
			console.log(err);
		});
}

function capNhatBlog(id) {
	let fd = new FormData();
	let image = getEle("fileupload-blog").files[0];

	fd.append("blog", image);

	fd.append("title", getEle("title-blog").value);
	fd.append("content", getEle("content-blog").value);
	console.log(fd);
	blogServices
		.updateBlogById(id, fd)
		.then(function (result) {
			if (result.status === 200 || result.status === 201) {
				console.log(result);
				Swal.fire({
					icon: "success",
					title: "Sửa slide thành công!!!",
					showConfirmButton: false,
					timer: 1500,
				});
				alert("ok");
				// getListProduct();
				// let a = document.getElementsByClassName("form-control");
				// Array.from(a).forEach((item) => (item.value = ""));
			}
		})
		.catch((error) => {
			console.log(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Sửa slide không thành công!!!",
				footer: "<a href>Sai òi!!!</a>",
			});
		});
}
