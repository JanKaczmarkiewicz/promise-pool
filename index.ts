const promisePool = <T>({
  promiseSeed,
  poolSize,
}: {
  promiseSeed: (() => Promise<T>)[];
  poolSize: number;
}): Promise<T[]> =>
  new Promise((resolve, reject) => {
    let promises = [];
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

// function poolPromises(iterPromises, poolSize) {
//   return new Promise((resolve, reject) => {
//     let promises = [];
//     function nextPromise() {
//       let { value, done } = iterPromises.next();
//       if (done) {
//         resolve(Promise.all(promises));
//       } else {
//         promises.push(value); // value is a promise
//         value.then(nextPromise, reject);
//       }
//       return !done;
//     }

//     while (promises.length < poolSize && nextPromise()) {}
//   });
// }
