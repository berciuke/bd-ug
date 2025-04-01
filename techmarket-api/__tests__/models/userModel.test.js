const pool = require("../../config/db");
const User = require("../../src/models/userModel");
const { clearTestData } = require("../testUtils");

describe("Model Użytkownika", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  afterAll(async () => {
    await clearTestData();
    await pool.end();
  });

  it("powinien utworzyć użytkownika z poprawnymi danymi", async () => {
    const userData = {
      username: "testuser1",
      email: "testuser1@example.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
    };

    const user = await User.create(userData);
    expect(user.id).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.first_name).toBe(userData.first_name);
    expect(user.last_name).toBe(userData.last_name);
    expect(user.password).toBeUndefined();
    expect(user.password_hash).toBeUndefined();
  });

  it("powinien uwierzytelnić użytkownika z poprawnymi danymi", async () => {
    const userData = {
      username: "testuser_auth",
      email: "testuser_auth@example.com",
      password: "password123",
      first_name: "Auth",
      last_name: "User",
    };

    await User.create(userData);

    const authenticatedUser = await User.authenticate(
      userData.username,
      userData.password
    );
    expect(authenticatedUser).toBeDefined();
    expect(authenticatedUser.username).toBe(userData.username);
    expect(authenticatedUser.password_hash).toBeUndefined();
  });

  it("powinien zwrócić null przy niepoprawnym haśle", async () => {
    const userData = {
      username: "testuser_wrong",
      email: "testuser_wrong@example.com",
      password: "password123",
      first_name: "Wrong",
      last_name: "User",
    };

    await User.create(userData);

    const authenticatedUser = await User.authenticate(
      userData.username,
      "złe_hasło"
    );
    expect(authenticatedUser).toBeNull();
  });

  it("powinien zaktualizować dane użytkownika", async () => {
    const userData = {
      username: "testuser_update",
      email: "testuser_update@example.com",
      password: "password123",
      first_name: "Update",
      last_name: "User",
    };

    const user = await User.create(userData);

    const updateData = {
      first_name: "Updated",
      last_name: "Name",
    };

    const updatedUser = await User.update(user.id, updateData);
    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.username).toBe(user.username);
    expect(updatedUser.first_name).toBe(updateData.first_name);
    expect(updatedUser.last_name).toBe(updateData.last_name);
  });
});
