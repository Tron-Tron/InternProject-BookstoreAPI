var reportServices = new reportService(localStorage.getItem("token"));
getReports();

function getReports() {
    reportServices
        .getReport()
        .then(function(result) {
            // localStorage.setItem("table-product", JSON.stringify(result.data.data));
            renderReport(result.data.data[0]);
        })
        .catch(function(error) {
            console.log(error);
        });
}
getNotifis();

function getNotifis() {
    reportServices
        .getNotifi()
        .then(function(result) {
            // localStorage.setItem("table-product", JSON.stringify(result.data.data));
            renderNotifi(result.data.data[0]);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function get_total_week() {
    reportServices
        .getTotalOfWeek()
        .then(function(result) {
            var data = google.visualization.arrayToDataTable([
                [String(result.data.data[0][0]), String(result.data.data[0][1])],
                [String(result.data.data[1][0]), parseInt(result.data.data[1][1])],
                [String(result.data.data[2][0]), parseInt(result.data.data[2][1])],
                [String(result.data.data[3][0]), parseInt(result.data.data[3][1])],
                [String(result.data.data[4][0]), parseInt(result.data.data[4][1])],
                [String(result.data.data[5][0]), parseInt(result.data.data[5][1])],
                [String(result.data.data[6][0]), parseInt(result.data.data[6][1])],
                [String(result.data.data[7][0]), parseInt(result.data.data[7][1])],
            ]);

            var options = {
                title: "Doanh thu tuần này của ChoCa.com",
                curveType: "function",
                width: 700,
                height: 500
            };

            var chart = new google.visualization.LineChart(
                document.getElementById("chart_div")
            );

            chart.draw(data, options);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function get_total_montt() {
    reportServices
        .getTotalOfMonth()
        .then(function(result) {
            var data = google.visualization.arrayToDataTable([
                [String(result.data.data[0][0]), String(result.data.data[0][1])],
                [String(result.data.data[1][0]), parseInt(result.data.data[1][1])],
                [String(result.data.data[2][0]), parseInt(result.data.data[2][1])],
                [String(result.data.data[3][0]), parseInt(result.data.data[3][1])],
                [String(result.data.data[4][0]), parseInt(result.data.data[4][1])],
                [String(result.data.data[5][0]), parseInt(result.data.data[5][1])],
                [String(result.data.data[6][0]), parseInt(result.data.data[6][1])],
                [String(result.data.data[7][0]), parseInt(result.data.data[7][1])],
                [String(result.data.data[8][0]), parseInt(result.data.data[8][1])],
                [String(result.data.data[9][0]), parseInt(result.data.data[9][1])],
                [String(result.data.data[10][0]), parseInt(result.data.data[10][1])],
                [String(result.data.data[11][0]), parseInt(result.data.data[11][1])],
                [String(result.data.data[12][0]), parseInt(result.data.data[12][1])],
            ]);

            var options = {
                title: "Doanh thu cả năm của ChoCa.com",
                curveType: "function",
                width: 700,
                height: 500,
            };

            var chart = new google.visualization.ColumnChart(
                document.getElementById("chart_div_year")
            );

            chart.draw(data, options);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function drawBasic() {}

function getEle(id) {
    return document.getElementById(id);
}

function renderReport(report) {
    var contentHTML = "";

    report.map(function(item) {
        const total = item.total_today + item.total_week + item.total_month;

        contentHTML += `
    <div class="contain-revenue">
      <div class="title">
        <h3>Tổng quan</h3>
      </div>
      <div class="container-pay">
        <div class="will-pay">
          <div class="title">
            <h5>Sẽ thanh toán</h5>
          </div>
          <div class="valua">
            <span class="title-price">Tổng cộng</span> <span class = "price-product">${item.will_pay ? item.will_pay : 0
			}</span>
          </div>
        </div>
        <div class="paid">
          <div class="title">
            <h5>Đã thanh toán</h5>
          </div>
          <div class="valua">
            <div class="date"><span class="title-price">Hôm nay</span><span class = "price-product">${item.total_today ? item.total_today : 0
			}</span></div>
            <div class="week"><span class="title-price">Tuần này</span><span class = "price-product">${item.total_today ? item.total_week : 0
			}</span></div>
            <div class="month">
              <span class="title-price">Tháng này</span><span class = "price-product">${item.total_today ? item.total_month : 0
			}</span>
            </div>
            <div class="all"><span class="title-price">Tổng cộng</span><span class = "price-product">${item.total_shop ? item.total_shop : 0
			}</span></div>
          </div>
        </div>
      </div>
    </div>`;
    });
    getEle("contain-revenue").innerHTML = contentHTML;
}

function renderNotifi(report) {
    var contentHTML = "";

    report.map(function(item) {
        const total = item.total_today + item.total_week + item.total_month;
        contentHTML += `
    
      <div class="element-nofi">
        <span>${item.unconfirmed ? item.unconfirmed : 0}</span>
        <p>Chờ xác nhận</p>
      </div>
      <div class="element-nofi">
        <span>${item.confirmed ? item.confirmed : 0}</span>
        <p>Đã xử lý</p>
      </div>
      <div class="element-nofi">
        <span>${item.cancel ? item.cancel : 0}</span>
        <p>Đơn Hủy</p>
      </div>
      <div class="element-nofi">
        <span>${item.out_stock ? item.out_stock : 0}</span>
        <p>Sản phẩm hết hàng</p>
      </div>
      <div class="element-nofi">
        <span>${item.product_store ? item.product_store : 0}</span>
        <p>Sản phẩm cửa hàng</p>
      </div>
      <div class="element-nofi">
        <span>${item.blog_store ? item.blog_store : 0}</span>
        <p>Bài viết cửa hàng</p>
      </div>
      <div class="element-nofi">
        <span>${item.slide_store ? item.slide_store : 0}</span>
        <p>Slide cửa hàng</p>
      </div>
      <div class="element-nofi">
        <span>${item.employees_store ? item.employees_store : 0}</span>
        <p>Nhân viên cửa hàng</p>
      </div>
      <div class="element-nofi">
        <span>${item.customer_store ? item.customer_store : 0}</span>
        <p>Khách hàng cửa hàng</p>
      </div>
    `;
    });
    getEle("main_todoList").innerHTML = contentHTML;
}