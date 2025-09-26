import request from "supertest";
import { app } from "../app.js";

describe("user controller functions", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send({ name: "Test", email: "test@example.com", password: "123456" });

    expect(res.body).toEqual({
      statusCode: 201,
      data: {
        name: "Test",
        email: "test@example.com"
      },
      message: "User Registered Successfully",
      success: true
    });
  });
});
