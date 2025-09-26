import { ApiResponse } from "../utils/ApiResponse.js";

const createSweet = async (req, res) => {
  const { name, description, category, price, stock } = req.body;

  const createdSweet = { name, description, category, price, stock };

  return res.status(201).json(
    new ApiResponse(201, createdSweet, "Sweet Created Successfully")
  );
};

export {createSweet};