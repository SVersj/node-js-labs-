const EventEmitter = require("events");
class MyDataEmitter extends EventEmitter {}

function Task5() {
  const dataEmitter = new MyDataEmitter();

  // Підписник
  dataEmitter.on("data", (chunk) => {
    console.log("Task 5 'data' event:", chunk);
  });

  dataEmitter.on("end", () => {
    console.log("Task 5 'end' event: done receiving data");
  });

  // Продюсер
  let count = 0;
  const interval = setInterval(() => {
    count++;
    dataEmitter.emit("data", `chunk #${count}`);
    if (count >= 5) {
      clearInterval(interval);
      dataEmitter.emit("end");
    }
  }, 500);
}
