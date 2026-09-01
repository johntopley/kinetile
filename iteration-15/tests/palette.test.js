import { describe, expect, it } from "vitest";
import { brickFaceColour, darken, lighten, mixHex, parseHex, toHex } from "../src/palette.js";

describe("palette", () => {
  it("round-trips a hex colour", () => {
    expect(toHex(parseHex("#5ad6ff"))).toBe("#5ad6ff");
  });

  it("lightens and darkens toward white and black", () => {
    expect(lighten("#000000", 1)).toBe("#ffffff");
    expect(darken("#ffffff", 1)).toBe("#000000");
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("dims a damaged multi-hit brick", () => {
    const fresh = brickFaceColour({ row: 0, hits: 2, maxHits: 2, shifting: false });
    const worn = brickFaceColour({ row: 0, hits: 1, maxHits: 2, shifting: false });
    expect(fresh).not.toBe(worn);
    expect(parseHex(worn).r).toBeLessThan(parseHex(fresh).r);
  });
});
