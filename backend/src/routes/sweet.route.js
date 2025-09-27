import express from "express";
import { addStock, buySweet, createSweet, deleteSweet, getAllSweets, searchSweet, updateSweet } from "../controllers/sweet.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = express.Router();


router.get("/search", searchSweet);

router.post("/create", verifyAdmin, upload.single("image"), createSweet);

router.post("/:sweet/addStock", verifyAdmin, addStock);

router.put("/:sweet", verifyAdmin, upload.single("image"), updateSweet);

router.delete("/:sweet", verifyAdmin, deleteSweet);

router.post("/:sweet/purchase", verifyJWT, buySweet);

router.get("/", getAllSweets);


export default router;
