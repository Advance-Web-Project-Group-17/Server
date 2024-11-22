import { expect } from "chai";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { insertUser } from "./models/User.js";
import { insertReview } from "./models/ReviewModel.js";
import { query } from "./helpers/db.js";

dotenv.config();

const baseUrl = "http://localhost:3001";
const jwtSecret = process.env.JWT_SECRET_KEY || "default-secret-key";

describe("Review API", () => {
  let user_id;
  let movie_id = 12345;
  let validToken;
  const review_text = "This is a test review.";
  const rating = 5;

  before(async () => {
    const userName = `testuser_${Date.now()}`;
    const email = `testuser_${Date.now()}@example.com`;
    const password = "testpassword";

    const userResponse = await insertUser(email, userName, password);
    user_id = userResponse.rows[0].user_id;

    validToken = jwt.sign({ user_id, email }, jwtSecret, { expiresIn: "1h" });
    await insertReview(user_id, movie_id, review_text, rating);
  });

  after(async () => {
    await query("DELETE FROM reviews WHERE user_id = $1 AND tmdb_id = $2", [user_id, movie_id]);
    await query("DELETE FROM users WHERE user_id = $1", [user_id]);
  });

  it("should post a review with a valid token", async () => {
    const response = await fetch(`${baseUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ movie_id, review_text, rating }),
    });

    const data = await response.json();
    expect(response.status).to.equal(201);
    expect(data.message).to.equal("Review added successfully");
  });

  it("should return 401 when no token is provided", async () => {
    const response = await fetch(`${baseUrl}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie_id, review_text, rating }),
    });
  
    // Debug: Log the raw response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Parsed JSON Response:", data);
  
      expect(response.status).to.equal(401);
      expect(data.message).to.equal("Unauthorized: No token provided");
    } else {
      const rawBody = await response.text();
      console.error("Raw Non-JSON Response:", rawBody);
      throw new Error("Response is not JSON");
    }
  });
  

  it("should return 403 when an invalid token is provided", async () => {
    const invalidToken = jwt.sign({ user_id, email: "invalid@example.com" }, "invalid_secret", { expiresIn: "1h" });

    const response = await fetch(`${baseUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${invalidToken}`,
      },
      body: JSON.stringify({ movie_id, review_text, rating }),
    });

    const data = await response.json(); // Parse JSON response
    console.log("Response Data (Invalid Token):", data);

    expect(response.status).to.equal(403);
    expect(data.message).to.equal("Unauthorized: Invalid token");
  });

  it("should fetch all reviews for a specific movie", async () => {
    const response = await fetch(`${baseUrl}/movies/${movie_id}/reviews`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("Parsed GET /movies/:movieId/reviews Response:", data);

    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.have.property("reviews").that.is.an("array");

    if (data.reviews.length > 0) {
      const review = data.reviews[0];
      expect(review).to.include.all.keys("review_id", "user_id", "review_text", "rating", "created_at", "user_name");
    }
  });
});
