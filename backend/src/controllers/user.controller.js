import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  const { name, email } = req.body;

  const createdUser = { name, email };

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User Registered Successfully")
  );
};

export {registerUser};
