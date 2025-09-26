import express from "express";
import { registerUser, loginUser, getUserPurchaseHistory, getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/purchase-history", verifyJWT, getUserPurchaseHistory);

router.get("/current", verifyJWT, getCurrentUser);

export default router;
