import { insertUser } from "./models/User.js";
import { insertReview } from "./models/ReviewModel.js";
import { expect } from "chai";
import fetch from "node-fetch";
import { query } from "./helpers/db.js";

const baseUrl = "http://localhost:3001";

describe("Review API", () => {
  let user_id;
  let movie_id = 12345; // Set a test movie ID (this should correspond to an actual movie in your DB or TMDB)
  const review_text = "This is a test review.";
  const rating = 5;

  before(async () => {
    const userName = `testuser_${Date.now()}`; // Generate unique user name
    const email = `testuser_${Date.now()}@example.com`; // Generate unique email
    const password = "testpassword";

    try {
      // Insert a test user and capture the user_id
      const userResponse = await insertUser(email, userName, password);

      if (!userResponse || !userResponse.rows) {
        throw new Error("Failed to insert user: userResponse is undefined or missing rows property");
      }

      user_id = userResponse.rows[0].user_id;

      // Optional: Insert a review for fetching tests
      await insertReview(user_id, movie_id, review_text, rating);
    } catch (error) {
      console.error("Error in before hook of Review API test:", error);
      throw error;
    }
  });

  afterEach(async () => {
    // Clean up test data after each test run
    await query("DELETE FROM reviews WHERE user_id = $1 AND tmdb_id = $2", [user_id, movie_id]);
  });

  after(async () => {
    // Clean up the test user after all tests are complete
    await query("DELETE FROM users WHERE user_id = $1", [user_id]);
  });

  describe("POST /reviews", () => {
    it("should post a review with valid data", async () => {
      const response = await fetch(`${baseUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, movie_id, review_text, rating }),
      });

      const rawResponse = await response.text(); // Read the raw response
      console.log("Raw POST /reviews Response:", rawResponse);

      const data = JSON.parse(rawResponse); // Parse as JSON

      console.log("Parsed POST /reviews Response:", data);

      expect(response.status).to.equal(201);
      expect(data).to.include.all.keys("message", "review");
      expect(data.review).to.include.all.keys("review_id", "user_id", "movie_id", "review_text", "rating", "created_at");
    });
  });

  describe("GET /movies/:movieId/reviews", () => {
    it("should fetch all reviews for a specific movie", async () => {
      const response = await fetch(`${baseUrl}/movies/${movie_id}/reviews`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const rawResponse = await response.text(); // Read the raw response
      console.log("Raw GET /movies/:movieId/reviews Response:", rawResponse);

      const data = JSON.parse(rawResponse); // Parse as JSON

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
});
