import promisePool from ".";

test("should result in combined promise with all promises resolved in order", async () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const one = jest.fn(() => wait(100).then(() => 1));
  const two = jest.fn(() => wait(20).then(() => 2));
  const three = jest.fn(() => wait(30).then(() => 3));
  const four = jest.fn(() => wait(70).then(() => 4));

  function* promiseSource() {
    yield one();
    yield two();
    yield three();
    yield four();
  }

  const resultPromise = promisePool({
    promiseSource: promiseSource(),
    poolSize: 2,
  });

  expect(one).toHaveBeenCalled();
  expect(two).toHaveBeenCalled();
  expect(three).not.toHaveBeenCalled();
  expect(four).not.toHaveBeenCalled();

  await wait(20);

  expect(three).toHaveBeenCalled();
  expect(four).not.toHaveBeenCalled();

  await wait(30);

  expect(four).toHaveBeenCalled();

  expect(await resultPromise).toEqual([1, 2, 3, 4]);
});
