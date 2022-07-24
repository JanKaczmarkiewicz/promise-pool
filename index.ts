const promisePool = <T>({
  promiseSource,
  poolSize,
}: {
  promiseSource: Iterator<Promise<T>, Promise<T> | void>;
  poolSize: number;
}): Promise<T[]> =>
  new Promise((resolve) => {
    const promises: Promise<T>[] = [];
    const handleNext = () => {
      const iteratorResult = promiseSource.next();

      iteratorResult.done
        ? resolve(Promise.all(promises))
        : promises.push(iteratorResult.value.finally(handleNext));
    };

    Array(poolSize).fill(null).forEach(handleNext);
  });

export default promisePool;
