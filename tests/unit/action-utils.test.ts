import { describe, it, expect } from "vitest";
import {
  actionError,
  actionSuccess,
  zodErrorMessage,
} from "@/lib/action-utils";
import { z } from "zod";

describe("actionError", () => {
  it("returns error result", () => {
    const result = actionError("Something went wrong");
    expect(result).toEqual({ success: false, error: "Something went wrong" });
  });

  it("success is false", () => {
    expect(actionError("test").success).toBe(false);
  });
});

describe("actionSuccess", () => {
  it("returns success with no data", () => {
    const result = actionSuccess();
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("returns success with data", () => {
    const result = actionSuccess({ id: "123" });
    expect(result).toEqual({ success: true, data: { id: "123" } });
  });

  it("success is true", () => {
    expect(actionSuccess().success).toBe(true);
  });
});

describe("zodErrorMessage", () => {
  it("extracts message from Zod error", () => {
    const schema = z.object({
      name: z.string().min(1, "Le nom est requis"),
    });
    const parsed = schema.safeParse({ name: "" });
    if (!parsed.success) {
      const msg = zodErrorMessage(parsed.error);
      expect(msg).toBe("Le nom est requis");
    }
  });

  it("handles multiple Zod errors (returns first)", () => {
    const schema = z.object({
      name: z.string().min(1, "Nom requis"),
      email: z.string().email("Email invalide"),
    });
    const parsed = schema.safeParse({ name: "", email: "bad" });
    if (!parsed.success) {
      const msg = zodErrorMessage(parsed.error);
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    }
  });

  it("returns fallback for invalid error format", () => {
    const fakeError = { message: "raw error" } as any;
    const msg = zodErrorMessage(fakeError);
    expect(msg).toBe("raw error");
  });
});
