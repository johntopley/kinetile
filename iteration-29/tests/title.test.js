import { describe, expect, it } from "vitest";
import { titleCaptionOpacity, titleLogoPose } from "../src/title.js";

describe("title animation", () => {
  it("starts hidden and settles into a floating pose", () => {
    const start = titleLogoPose(0);
    const settled = titleLogoPose(2);
    expect(start.opacity).toBe(0);
    expect(start.y).toBeLessThan(settled.y);
    expect(settled.opacity).toBe(1);
    expect(settled.scale).toBeGreaterThan(start.scale);
  });

  it("bobs the logo after the intro", () => {
    const a = titleLogoPose(2);
    const b = titleLogoPose(2.7);
    expect(a.y).not.toBeCloseTo(b.y);
  });

  it("keeps the caption invisible until the logo has appeared", () => {
    expect(titleCaptionOpacity(0)).toBe(0);
    expect(titleCaptionOpacity(0.4)).toBe(0);
    expect(titleCaptionOpacity(1.4)).toBe(1);
  });
});
