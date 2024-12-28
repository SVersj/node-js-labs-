async function asyncMapPromiseCancellable(array, promiseFn, { signal }) {
  let results = new Array(array.length);

  const tasks = array.map((item, index) => {
    return (async () => {
      if (signal.aborted) {
        throw new Error("Operation was cancelled before start");
      }

      const res = await promiseFn(item, signal);

      if (signal.aborted) {
        throw new Error("Operation was cancelled mid-flight");
      }

      results[index] = res;
    })();
  });

  const signalPromise = new Promise((_, reject) => {
    signal.addEventListener("abort", () => {
      reject(new Error("Aborted via AbortController"));
    });
  });

  await Promise.race([Promise.all(tasks), signalPromise]);

  return results;
}