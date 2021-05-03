const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const connectTestDB = require("../config/testdb");

beforeAll(() => {
  connectTestDB();
});

const validUser = {
  name: "user1",
  email: "user1@mail.com",
  password: "P4ssword",
};

const postUser = (user = validUser) => {
  return request(app).post("/api/v1/auth/register").send(user);
};

describe("User registration tests", () => {
  it("returns 201 OK when signup request is valid", async () => {
    const response = await postUser();
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created");
  });
});
