import { describe, expect, it } from "vitest";
import { COURT_PATTERN_COUNT, courtPattern } from "../src/court.js";

describe("court texture", () => {
  it("cycles a fixed set of patterns by level", () => {
    expect(courtPattern(1)).toBe(0);
    expect(courtPattern(2)).toBe(1);
    expect(courtPattern(COURT_PATTERN_COUNT + 1)).toBe(0);
    expect(courtPattern(COURT_PATTERN_COUNT + 3)).toBe(2);
  });
});
