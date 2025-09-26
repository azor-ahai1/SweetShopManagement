import express from "express";
import { createSweet } from "../controllers/sweet.controller.js";

const router = express.Router();

router.post("/create", createSweet);

export default router;
