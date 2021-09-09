var cartServices = new cartService(localStorage.getItem("token"));
getListCartCustomer();
var formatPrice = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
function getEle(id) {
  return document.getElementById(id);
}

function renderCartCustomer(objCart) {
  let contentHTML = "";
  objCart.products.map(function (item) {
    let price = formatPrice.format(item.productId.price);
    let priceTotalProduct = formatPrice.format(
      item.productId.price * item.amountCart
    );
    contentHTML += `<div class="cart-item">
    <div class="cart-item-col cart-item-col-img"><img src="../../../../uploads/product/${item.productId.image[0]}" alt="Image"
            class="img-cart-item"></div>
    <div class="cart-item-col cart-item-col-nameP">${item.productId.name}</div>
    <div class="cart-item-col cart-item-col-priceP">${price}</div>
    <div class="cart-item-col cart-item-col-numberP">${item.amountCart}</div>
    <div class="cart-item-col cart-item-col-totalPriceP">${priceTotalProduct}</div>
    </div>`;
  });
  // console.log("item", item);
  getEle("cart-container").innerHTML = contentHTML;
}

function getListCartCustomer(arrCart) {
  cartServices
    .getCartCustomer()
    .then((result) => {
      console.log("result", result.data.data);
      renderCartCustomer(result.data.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
