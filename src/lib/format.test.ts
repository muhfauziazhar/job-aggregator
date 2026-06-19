import { describe, it, expect } from "vitest";
import { relativeDate, salaryLabel } from "./format";

const NOW = new Date("2026-06-19T00:00:00.000Z").getTime();

describe("relativeDate", () => {
  it("formats recent times", () => {
    expect(relativeDate("2026-06-18T23:59:30Z", NOW)).toBe("just now");
    expect(relativeDate("2026-06-18T23:30:00Z", NOW)).toBe("30m ago");
    expect(relativeDate("2026-06-18T20:00:00Z", NOW)).toBe("4h ago");
  });

  it("formats days and months", () => {
    expect(relativeDate("2026-06-18T00:00:00Z", NOW)).toBe("yesterday");
    expect(relativeDate("2026-06-14T00:00:00Z", NOW)).toBe("5 days ago");
    expect(relativeDate("2026-04-20T00:00:00Z", NOW)).toBe("2 months ago");
  });

  it("returns empty string for invalid input", () => {
    expect(relativeDate("not-a-date", NOW)).toBe("");
  });
});

describe("salaryLabel", () => {
  it("formats ranges", () => {
    expect(salaryLabel({ salaryMin: 120000, salaryMax: 160000, salaryCurrency: "USD" })).toBe("$120k–$160k");
  });
  it("handles open-ended ranges", () => {
    expect(salaryLabel({ salaryMin: 90000, salaryMax: null, salaryCurrency: "USD" })).toBe("from $90k");
    expect(salaryLabel({ salaryMin: null, salaryMax: 90000, salaryCurrency: "USD" })).toBe("up to $90k");
  });
  it("returns empty when no salary", () => {
    expect(salaryLabel({ salaryMin: null, salaryMax: null, salaryCurrency: null })).toBe("");
  });
});
