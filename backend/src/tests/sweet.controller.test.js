import request from "supertest";
import { app } from "../app.js";

describe("sweet controller functions", () => {
  it("should create a new sweet", async () => {
    const res = await request(app)
      .post("/api/v1/sweets/create")
      .send({ name: "Test", description: "testqwertyuiop", category: "asdf", price:100, stock:75});

    expect(res.body).toEqual({
      statusCode: 201,
      data: {
        name: "Test", 
        description: "testqwertyuiop", 
        category: "asdf", 
        price:100, 
        stock:75
      },
      message: "Sweet Created Successfully",
      success: true
    });
  });
});