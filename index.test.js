import { expect } from "chai";
import { initializeTestDb, insertTestUser } from "./helpers/test.js";
import { startServer, stopServer } from "./testSetup.js";
import { query } from "./helpers/db.js";
const baseUrl = "http://localhost:3001";

describe("Task API Tests", function () {
  before(async function () {
    await startServer();
    await initializeTestDb();
  });

  after(async function () {
    await stopServer();
  });
});

describe("POST register", () => {
    const email = "testmail_unique1@gmail.com";
    const user_name = "testusername"
    beforeEach(async () => {
        await initializeTestDb();
        await query ("delete from users where email = $1", [email]) // Clear database between tests to avoid duplicates
    });
  
    it("should register with valid email, password and user_name", async () => {
        const password = "testpassword";
        const response = await fetch(`${baseUrl}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, user_name }),
        });
  
        expect(response.status).to.equal(201);
  
        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error(
                "Failed to parse JSON response during valid registration:",
                {
                    status: response.status,
                    headers: response.headers.raw(),
                    raw: await response.text() // Log the raw response
                }
            );
            throw error;
        }
  
        expect(data).to.include.all.keys('user_id', 'user_name');
    });
  
    it("should not post a user with less than 8 character password", async () => {
        const password = "short";
        const response = await fetch(`${baseUrl}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }), // password too short
        });
  
        // Check status first to handle non-JSON errors
        expect(response.status).to.equal(400);
  
        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error("Failed to parse JSON response:", {
                status: response.status,
                headers: response.headers.raw(),
                raw: await response.text() // Log raw response if parsing fails
            });
            throw error;
        }
  
        expect(data).to.have.property("error");
        expect(data).to.have.all.keys('error')
    });
  });
  
  
  describe("POST login", () => {
    const user_name = "testmail_unique1@gmail.com";
    const password = "testpassword";
    insertTestUser(user_name, password);
    it("should not login if user not verify", async () => {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, password }),
      });
  
      const data = await response.json();
  
      expect(response.status).to.equal(401);
      expect(data).to.include.all.keys("message");
    });
  });
  