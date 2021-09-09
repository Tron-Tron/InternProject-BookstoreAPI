function staffService(token) {
  this.addNewStaff = function (staff) {
    console.log("staff", staff);
    return axios({
      method: "POST",
      url: "http://localhost:3000/api/staff/",
      data: staff,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  this.getStaffsList = function () {
    return axios({
      method: "GET",
      url: "http://localhost:3000/api/staff/all",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.deleteStaffById = function (id) {
    return axios({
      method: "DELETE",
      url: `http://localhost:3000/api/staff/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  this.updateStaffById = function (id, staff) {
    return axios({
      method: "PATCH",
      url: `http://localhost:3000/api/staff/${id}`,
      data: staff,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.getStaffById = function (id) {
    return axios({
      method: "GET",
      url: `http://localhost:3000/api/staff/${id}`,
      headers: {
        "Content-Type": "multipart/form-data",
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
        "Content-Type": "application/json",
      },
    });
  };

  this.changePassAccount = function (pass, newPassword) {
    const data = JSON.stringify({
      Password: pass,
      newPassword: newPassword,
    });
    return axios({
      method: "PATCH",
      url: `http://localhost:5000/api/v1/auth/changepassword`,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  this.logout = function () {
    return axios({
      method: "GET",
      url: "http://localhost:5000/api/v1/auth/logout",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
