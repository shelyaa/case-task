import { jest } from "@jest/globals";

jest.unstable_mockModule("../../db/db.js", () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

const { pool } = await import("../../db/db.js");
const axios = await import("axios");
const {
  createSubscription,
  confirmSubscription,
  unsubscribeSubscription,
  getSubscriptionsByEmail,
} = await import("../../services/subscriptionService.js");

describe("createSubscription", () => {
  beforeEach(() => jest.clearAllMocks());

  test("throws 400 if repo format is invalid", async () => {
    await expect(createSubscription("test@gmail.com", "golanggo"))
      .rejects.toMatchObject({ status: 400 });
  });

  test("throws 404 if repo does not exist on GitHub", async () => {
    axios.default.get.mockRejectedValue({ response: { status: 404 } });

    await expect(createSubscription("test@gmail.com", "owner/repo"))
      .rejects.toMatchObject({ status: 404 });
  });

  test("saves subscription to DB if input is valid", async () => {
    axios.default.get.mockResolvedValue({ data: {} });
    pool.query.mockResolvedValue({});

    await createSubscription("test@gmail.com", "golang/go");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO subscriptions"),
      expect.arrayContaining(["test@gmail.com", "golang/go"])
    );
  });
});

describe("confirmSubscription", () => {
  beforeEach(() => jest.clearAllMocks());

  test("throws 404 if token is not found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await expect(confirmSubscription("invalid-token"))
      .rejects.toMatchObject({ status: 404 });
  });

  test("sets confirmed = true if token is valid", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});

    await confirmSubscription("valid-token");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE subscriptions SET confirmed = true"),
      ["valid-token"]
    );
  });
});

describe("unsubscribeSubscription", () => {
  beforeEach(() => jest.clearAllMocks());

  test("throws 404 if token is not found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await expect(unsubscribeSubscription("invalid-token"))
      .rejects.toMatchObject({ status: 404 });
  });

  test("deletes subscription if token is valid", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});

    await unsubscribeSubscription("valid-token");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM subscriptions"),
      ["valid-token"]
    );
  });
});

describe("getSubscriptionsByEmail", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns only confirmed subscriptions", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, email: "test@gmail.com", repo: "golang/go" }],
    });

    const result = await getSubscriptionsByEmail("test@gmail.com");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("confirmed = true"),
      ["test@gmail.com"]
    );
    expect(result).toHaveLength(1);
  });

  test("returns empty array if no subscriptions found", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await getSubscriptionsByEmail("empty@gmail.com");

    expect(result).toEqual([]);
  });
});