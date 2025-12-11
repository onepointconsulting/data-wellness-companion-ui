import { ulid, decodeTime } from "ulid";
import {expect, test} from '@jest/globals'

test("ulidDecodeTime", () => {
  const ulidstr = ulid();
  expect(ulidstr).toBeTruthy();
  const timeNumber = decodeTime(ulidstr);
  expect(timeNumber).toBeTruthy();
  expect(new Date(timeNumber)).toBeTruthy();
});

test("ulidDecodeTimeFail", () => {
  const oldUuid = "abd737e8-3f26-410d-bb3d-a8b952799ebc";
  try {
    decodeTime(oldUuid);
    expect(false).toBe(true);
  } catch (e) {
    expect(e).toBeTruthy();
  }
});
