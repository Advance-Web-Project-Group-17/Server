/*import { expect } from "chai";
import { initializeTestDb, insertUser } from "./helpers/test.js";
import { startServer, stopServer } from "./testSetup.js";
const baseUrl = "http://localhost:3002";

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
        await initializeTestDb(); // Clear database between tests to avoid duplicates
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
    const email = "testmail_unique1@gmail.com";
    const password = "testpassword";
    insertUser(email, password);
    it("should login with valid credentials", async () => {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      expect(response.status).to.equal(200);
      expect(data).to.include.all.keys("id", "token");
    });
  });*/
  




  // Updated file with Account Deletion Test


  import { expect } from "chai";
import { initializeTestDb, insertUser, deleteTestUser } from "./helpers/test.js"; // Import deleteTestUser
import { startServer, stopServer } from "./testSetup.js";
const baseUrl = "http://localhost:3002";

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
        await initializeTestDb(); // Clear database between tests to avoid duplicates
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
    const email = "testmail_unique1@gmail.com";
    const password = "testpassword";
    insertUser(email, password);
    it("should login with valid credentials", async () => {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      expect(response.status).to.equal(200);
      expect(data).to.include.all.keys("id", "token");
    });
  });

  describe("DELETE user", () => {
    const email = "testmail_delete@gmail.com";
    const password = "testpassword";
    const user_name = "testusername_delete"
    let userId;

    beforeEach(async () => {
        await initializeTestDb(); // Clear database between tests
        const response = await fetch(`${baseUrl}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, user_name }),
        });

        const data = await response.json();
        userId = data.user_id;
    });

    it("should delete user account with valid ID", async () => {
        const response = await fetch(`${baseUrl}/user/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        });

        expect(response.status).to.equal(200);

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

        expect(data).to.have.property("message", "User account and related data deleted successfully");
    });
  });

  // Optional: Add movie search tests here later




  /*import { expect } from "chai";
  import fetch from "node-fetch";
  import { initializeTestDb, insertUser } from "./helpers/test.js";
  import { startServer, stopServer } from "./testSetup.js";
  import dotenv from "dotenv";
  import pkg from 'pg';
  
  dotenv.config(); // Load environment variables
  
  const { Client } = pkg;
  const baseUrl = "http://localhost:3002";
  
  // Utility function to check table existence
  const checkTableExists = async (tableName) => {
    const client = new Client({
      connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    });
    await client.connect();
    const res = await client.query(`SELECT to_regclass('${tableName}');`);
    await client.end();
    return res.rows[0].to_regclass !== null;
  };
  
  // Start and stop the server before and after all tests
  before(async function () {
    this.timeout(10000); // Extend timeout to 10 seconds
    await startServer();
    await initializeTestDb();
    console.log("Database initialized for tests");
  });
  
  after(async function () {
    this.timeout(10000); // Extend timeout to 10 seconds
    await stopServer();
  });
  
  describe("POST register", () => {
    const email = "testmail_unique1@gmail.com";
    const user_name = "testusername";
  
    // Clear database between tests
    beforeEach(async function () {
      this.timeout(5000); // Extend timeout for beforeEach to 5 seconds
      await initializeTestDb();
      console.log("Database reinitialized before test");
      const usersTableExists = await checkTableExists('users');
      console.log(`Users table exists: ${usersTableExists}`);
    });
  
    it("should register with valid email, password, and user_name", async function () {
      this.timeout(5000); // Extend timeout for individual test to 5 seconds
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
        console.error("Failed to parse JSON response during valid registration:", {
          status: response.status,
          headers: response.headers.raw(),
          raw: await response.text(), // Log the raw response
        });
        throw error;
      }
  
      expect(data).to.include.all.keys("message");
    });
  
    it("should not register a user with less than 8 character password", async function () {
      this.timeout(5000); // Extend timeout for individual test to 5 seconds
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
          raw: await response.text(), // Log raw response if parsing fails
        });
        throw error;
      }
  
      expect(data).to.have.property("error");
    });
  });
  
  describe("POST login", () => {
    const email = "testmail_unique1@gmail.com";
    const password = "testpassword";
  
    // Ensure test database is initialized and user is inserted
    beforeEach(async function () {
      this.timeout(5000); // Extend timeout for beforeEach to 5 seconds
      await initializeTestDb();
      await insertUser(email, password);
      console.log("Database reinitialized and user inserted before test");
      const usersTableExists = await checkTableExists('users');
      console.log(`Users table exists: ${usersTableExists}`);
    });
  
    it("should login with valid credentials", async function () {
      this.timeout(5000); // Extend timeout for individual test to 5 seconds
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: "testusername", password }),
      });
  
      expect(response.status).to.equal(200);
  
      const data = await response.json();
      expect(data).to.include.all.keys("id", "token");
    });
  });*/