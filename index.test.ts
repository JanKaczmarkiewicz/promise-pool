import promisePool from ".";

test("should result in combined promise with all promises resolved in order", async () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const promiseSeed = [
    jest.fn(() => wait(100).then(() => 1)),
    jest.fn(() => wait(20).then(() => 2)),
    jest.fn(() => wait(30).then(() => 3)),
    jest.fn(() => wait(70).then(() => 4)),
  ];

  const resultPromise = promisePool({ promiseSeed, poolSize: 2 });

  expect(promiseSeed[0]).toHaveBeenCalled();
  expect(promiseSeed[1]).toHaveBeenCalled();
  expect(promiseSeed[2]).not.toHaveBeenCalled();
  expect(promiseSeed[3]).not.toHaveBeenCalled();

  await wait(20);

  expect(promiseSeed[2]).toHaveBeenCalled();
  expect(promiseSeed[3]).not.toHaveBeenCalled();

  await wait(30);

  expect(promiseSeed[3]).toHaveBeenCalled();

  expect(await resultPromise).toEqual([1, 2, 3, 4]);
});
