import express from "express";
import { addStock, buySweet, createSweet, deleteSweet, getAllSweets, updateSweet } from "../controllers/sweet.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/create", verifyAdmin, upload.single("image"), createSweet);

router.post("/:sweet/addStock", verifyAdmin, addStock);

router.put("/:sweet", verifyAdmin, upload.single("image"), updateSweet);

router.delete("/:sweet", verifyAdmin, deleteSweet);

router.post("/:sweet/purchase", verifyJWT, buySweet);

router.get("/", getAllSweets);

router.get("/search", searchSweet);

export default router;
