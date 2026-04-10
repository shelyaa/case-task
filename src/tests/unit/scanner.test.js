import { jest } from "@jest/globals";

jest.unstable_mockModule("../../db/db.js", () => ({
  pool: { query: jest.fn() },
}));

jest.unstable_mockModule("axios", () => ({
  default: { get: jest.fn() },
}));

jest.unstable_mockModule("../../services/emailService.js", () => ({
  sendReleaseNotification: jest.fn(),
}));

jest.unstable_mockModule("node-cron", () => ({
  default: { schedule: jest.fn() },
}));

const { pool } = await import("../../db/db.js");
const axios = await import("axios");
const { sendReleaseNotification } = await import("../../services/emailService.js");
const { checkReleases } = await import("../../services/scannerService.js");

describe("checkReleases", () => {
  beforeEach(() => jest.clearAllMocks());

  test("sends email if a new release is detected", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ repo: "golang/go" }] })
      .mockResolvedValueOnce({ rows: [{ last_seen_tag: "v1.21.0" }] })
      .mockResolvedValueOnce({ rows: [{ email: "test@gmail.com" }] })
      .mockResolvedValueOnce({});

    axios.default.get.mockResolvedValue({ data: { tag_name: "v1.22.0" } });

    await checkReleases();

    expect(sendReleaseNotification).toHaveBeenCalledWith(
      "test@gmail.com",
      "golang/go",
      "v1.22.0"
    );
  });

  test("does not send email if release has not changed", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ repo: "golang/go" }] })
      .mockResolvedValueOnce({ rows: [{ last_seen_tag: "v1.22.0" }] });

    axios.default.get.mockResolvedValue({ data: { tag_name: "v1.22.0" } });

    await checkReleases();

    expect(sendReleaseNotification).not.toHaveBeenCalled();
  });

  test("does not send email if repo has no releases", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ repo: "golang/go" }] });

    axios.default.get.mockRejectedValue({ response: { status: 404 } });

    await checkReleases();

    expect(sendReleaseNotification).not.toHaveBeenCalled();
  });
});