function asyncMapPromise(array, promiseFn, { concurrency = Infinity } = {}) {
  let results = new Array(array.length);
  let inFlight = 0;
  let currentIndex = 0;
  let resolveFn, rejectFn;

  const masterPromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  function runNext() {
    if (currentIndex >= array.length && inFlight === 0) {
      return resolveFn(results);
    }

    while (inFlight < concurrency && currentIndex < array.length) {
      const idx = currentIndex++;
      inFlight++;

      promiseFn(array[idx])
        .then((res) => {
          results[idx] = res;
          inFlight--;
          runNext();
        })
        .catch((err) => {
          rejectFn(err);
        });
    }
  }

  runNext();
  return masterPromise;
}
