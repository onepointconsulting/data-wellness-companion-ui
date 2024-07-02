import { ulid, decodeTime } from 'ulid'

test('ulidDecodeTime', () => {
  const ulidstr = ulid()
  expect(ulidstr).toBeTruthy()
  const timeNumber = decodeTime(ulidstr)
  expect(timeNumber).toBeTruthy()
  expect(new Date(timeNumber)).toBeTruthy()
})

test('ulidDecodeTimeFail', () => {
  const oldUuid = 'abd737e8-3f26-410d-bb3d-a8b952799ebc'
  try {
    decodeTime(oldUuid)
    fail("Should have thrown an error")
  } catch (e) {
    expect(e).toBeTruthy()
  }
})