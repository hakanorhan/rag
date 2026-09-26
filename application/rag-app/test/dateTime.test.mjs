import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidDateRange } from "../src/lib/dateTime.ts";

const pickupAt = "2030-01-01T10:00:00Z";

test("accepts a rental period of exactly two hours", () => {
  assert.equal(isValidDateRange(pickupAt, "2030-01-01T12:00:00Z"), true);
});

test("rejects a rental period shorter than two hours", () => {
  assert.equal(isValidDateRange(pickupAt, "2030-01-01T11:59:00Z"), false);
});

test("rejects a return before pickup", () => {
  assert.equal(isValidDateRange(pickupAt, "2030-01-01T09:00:00Z"), false);
});

test("rejects equal pickup and return times", () => {
  assert.equal(isValidDateRange(pickupAt, pickupAt), false);
});

test("rejects a missing pickup time", () => {
  assert.equal(isValidDateRange(null, "2030-01-01T12:00:00Z"), false);
});

test("rejects a missing return time", () => {
  assert.equal(isValidDateRange(pickupAt, null), false);
});

test("rejects a rental period in the past", () => {
  const pickupAt = "2020-01-01T10:00:00Z";
  const returnAt = "2020-01-02T10:00:00Z";

  assert.equal(isValidDateRange(pickupAt, returnAt), false);
});

test("rejects a timestamp without a timezone offset", () => {
  assert.equal(isValidDateRange(pickupAt, "2030-01-01T12:00:00"), false);
});

test("uses elapsed time when timezone offsets differ", () => {
  const pickupAt = "2030-03-31T01:30:00+01:00";
  const returnAt = "2030-03-31T03:30:00+02:00";

  assert.equal(isValidDateRange(pickupAt, returnAt), false);
});