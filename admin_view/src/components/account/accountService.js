class request {
  constructor() {
    this.maNhom = "001";
    this.token = localStorage.getItem("admin")
      ? JSON.parse(localStorage.getItem("admin")).accessToken
      : null;
  }

  login(data) {
    console.log("vao day k", data);
    return axios({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      data,
    });
  }

  register(user) {
    return axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/register",
      data: user,
      headers: {
        Authorization: "Bearer " + this.token,
      },
    });
  }
}

export default request;
