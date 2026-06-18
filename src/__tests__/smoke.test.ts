import { describe, it, expect } from "vitest";

// Smoke test — proves the test runner, jsdom env, and path alias all work.
// Replaced by real unit tests as features land (classifier, tagger, normalizer).
describe("smoke", () => {
  it("runs the test suite", () => {
    expect(1 + 1).toBe(2);
  });
});
