function Product(
  _id,
  _ProductName,
  _Price,
  _Date,
  _Amount,
  _Description,
  _Image,
  _idCategory,
  _Distributor,
  _flag,
  _view,
  _Remark
) {
  //key: value
  (this.id = _id),
    (this.ProductName = _ProductName),
    (this.Price = _Price),
    (this.Date = _Date),
    (this.Amount = _Amount);
  (this.Description = _Description),
  (this.Image = _Image),

    (this.idCategory = _idCategory),
    (this.Distributor = _Distributor),
    (this.status = _flag),
    (this.view = _view),
    (this.Remark = _Remark);
}
