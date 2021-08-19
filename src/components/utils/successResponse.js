class SuccessResponse {
  constructor(code, data, success = true) {
    this.success = success;
    this.code = code;
    this.data = data;
  }
  send(res) {
    //  const result = { code: this.code, success: this.success, data: this.data };
    return res.status(this.code).json(this);
  }
}
export default SuccessResponse;
