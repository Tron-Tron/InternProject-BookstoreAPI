var silderServices = new sliderService(localStorage.getItem("token"));

// Lấy danh sách slide
function getListSlider() {
    silderServices
        .getSliderList()
        .then(function(result) {
            // localStorage.setItem("table-product", JSON.stringify(result.data.data));
            console.log(result);
            renderSliderTable(result.data.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function renderSliderTable(mangSanPham) {
    var contentHTML = "";
    mangSanPham.map(function(item) {

        const date = new Date(item.dateSlide);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const formatDate = day + "/" + month + "/" + year;

        contentHTML += `
        <div class="element-slide">
        <div class="img-container">
			<a target="_blank" href="../../../resource/imgs/slide/${item.image}">
				<img
					src="../../../resource/imgs/slide/${item.image}"
					alt=""
				/>
			</a>
        </div>

        <div class="content-slide">
          <p class="date-slide">Ngày thêm: <span>${formatDate}</span></p>
          <div class="action">
            <button
              type="button"
              data-toggle="modal"
              data-target="#add-slide"
              type="button"
              class="btn btn-success custom-bnt"
              onclick="suaSlide('${item.id}')"
            >
              Sửa
            </button>
            <button type="button" class="btn btn-danger custom-bnt" onclick="deleteSliderById('${item.id}')">
              Xóa
            </button>
          </div>
        </div>
      </div>
      `;
    });
    getEle("list-slider").innerHTML = contentHTML;
}

// Thêm silde
function themSlide() {
    let fd = new FormData();
    event.preventDefault();
    fd.append("slide", getEle("fileupload-slide").files[0]);

    silderServices
        .addSlider(fd)
        .then((result) => {
            if (result.status === 200 || result.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm side thành công!!!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            getListSlider();
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Thêm slide không thành công!!!",
                footer: "<a href>Sai òi!!!</a>",
            });
        });
}

function deleteSliderById(id) {
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
            silderServices
                .deleteSlider(id)
                .then((result) => {
                    if (result.status === 200 || result.status === 201) {
                        getListSlider();
                        Swal.fire({
                            icon: "success",
                            title: "Xóa side thành công!!!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                    getListSlider();
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

function suaSlide(idSlide) {
    silderServices
        .getSliderById(idSlide)
        .then(function(result) {
            const path = "../../../resource/imgs/slide/";

            localStorage.setItem("idSlide", idSlide);

            console.log(result.data.data[0]);
            var pathnew = path + result.data.data[0].image;
            console.log(pathnew);
            getEle("upload-img-slide").src = pathnew;
            // getEle("image-productE").value = result.data.data[0].Image;
        })
        .catch(function(err) {
            console.log(err);
        });

    document.getElementById("modal-slide").innerText = "Chỉnh Sửa Slide";
    document.getElementById("btn-edit-slide").classList.remove("hidden");
    document.getElementById("bnt-add-slide").classList.add("hidden");
}

function capNhatSlider(id) {
    let fd = new FormData();
    let image = getEle("fileupload-slide").files[0];

    fd.append("slide", image);

    console.log(fd);
    silderServices
        .updateSliderById(id, fd)
        .then(function(result) {
            if (result.status === 200 || result.status === 201) {
                console.log(result);
                Swal.fire({
                    icon: "success",
                    title: "Sửa slide thành công!!!",
                    showConfirmButton: false,
                    timer: 1500,
                });
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