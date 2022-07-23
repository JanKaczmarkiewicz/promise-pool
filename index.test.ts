import promisePool from ".";

test("should result in combined promise with all promises resolved", async () => {
  const promiseSeed = [1, 2, 3, 4].map((item) => () => Promise.resolve(item));

  const result = await promisePool({ promiseSeed, poolSize: 2 });
  expect(result).toEqual([1, 2, 3, 4]);
});
