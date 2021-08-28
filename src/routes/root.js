import auth from "../components/auth/authRoute.js";
import user from "../components/users/userRouter.js";
import category from "../components/categories/categoryRouter.js";
import product from "../components/products/productRouter.js";
import cart from "../components/carts/cartRouter.js";
import order from "../components/orders/orderRouter.js";
import report from "../components/reports/reportRouter.js";
import customer from "../components/customers/customerRouter.js";
import store from "../components/store/storeRouter.js";
import staff from "../components/staffs/staffRouter.js";
import promotion from "../components/promotions/promotionRouter.js";
import express from "express";

const router = express.Router();
router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);
router.use("/product", product);
router.use("/staff", staff);
router.use("/cart", cart);
router.use("/order", order);
router.use("/report", report);
router.use("/store", store);
router.use("/customer", customer);
router.use("/promotion", promotion);

export default router;
