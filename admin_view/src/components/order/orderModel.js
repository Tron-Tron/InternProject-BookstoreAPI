function Order(
  _total,
  _email,
  _idCustomer,
  _Payment,
  _OrderDate,
  _Status,
  _Note,
  _Address
) {
  this.total = _total;
  this.idCustomer = idCustomer;
  this.email = _email;
  this.Payment = _Payment;
  this.OrderDate = _OrderDate;
  this.Status = _Status;
  this.Note = _Note;
  this.Address = _Address;
}
