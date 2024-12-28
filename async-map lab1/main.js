function asyncMap(
  array,
  asyncIteratorFn,
  finalCallback,
  debounceThreshold = 0
) {
  let results = [];
  let completed = 0;
  let hasError = false;

  array.forEach((item, index) => {
    const startTime = Date.now();

    asyncIteratorFn(item, (err, transformed) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return finalCallback(err);
      }

      const elapsed = Date.now() - startTime;

      // If operation finished quicker than the threshold – add a delay
      if (elapsed < debounceThreshold) {
        const delay = debounceThreshold - elapsed;
        setTimeout(() => {
          results[index] = transformed;
          checkDone();
        }, delay);
      } else {
        results[index] = transformed;
        checkDone();
      }
    });
  });

  function checkDone() {
    completed++;
    if (completed === array.length) {
      finalCallback(null, results);
    }
  }
}
