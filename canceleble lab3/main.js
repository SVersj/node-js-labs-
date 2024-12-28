async function asyncMapPromiseCancellable(array, promiseFn, { signal }) {
  let results = new Array(array.length);

 
  const tasks = array.map((item, index) => {
    return (async () => {
     
      const res = await promiseFn(item, signal);

     
      results[index] = res;
    })();
  });


  const signalPromise = new Promise((resolve) => {
    
    signal.addEventListener("abort", () => {
      resolve("Signal ignored"); 
    });
  });

 
  await Promise.race([Promise.all(tasks)]);

  
  return results;
}
