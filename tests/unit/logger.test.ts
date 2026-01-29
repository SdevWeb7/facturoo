import { describe, it, expect, vi } from "vitest";
import { logAction } from "@/lib/logger";

describe("logAction", () => {
  it("logs action as JSON", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logAction("test.action", "user-123");

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.action).toBe("test.action");
    expect(logged.userId).toBe("user-123");
    expect(logged.timestamp).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("includes metadata", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logAction("client.created", "user-456", { clientId: "c-789" });

    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.clientId).toBe("c-789");

    consoleSpy.mockRestore();
  });

  it("produces valid ISO timestamp", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    logAction("test", "user");

    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    const date = new Date(logged.timestamp);
    expect(date.getTime()).not.toBeNaN();

    consoleSpy.mockRestore();
  });
});
