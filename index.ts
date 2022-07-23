const promisePool = <T>({
  promiseSeed,
  poolSize,
}: {
  promiseSeed: (() => Promise<T>)[];
  poolSize: number;
}): Promise<T[]> =>
  new Promise((resolve) => {
    let promises: Promise<T>[] = [];
    const handlePromise = (cb: () => Promise<T>) => {
      promises.push(
        cb().then((result) => {
          const item = promiseSeed[promises.length];
          item ? handlePromise(item) : resolve(Promise.all(promises));
          return result;
        })
      );
    };

    promiseSeed.slice(0, poolSize).forEach(handlePromise);
  });

export default promisePool;
