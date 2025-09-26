import express from "express";
import { createSweet, getAllSweets } from "../controllers/sweet.controller.js";

const router = express.Router();

router.post("/create", createSweet);
router.post("/", getAllSweets);

export default router;
