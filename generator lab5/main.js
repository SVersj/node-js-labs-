const fs = require("fs");

async function* readHugeFileLines(filePath) {
  const stream = fs.createReadStream(filePath, {
    encoding: "utf8",
    flags: "r",
  });

  let leftover = "";
  for await (const chunk of stream) {
    leftover += chunk;
    const lines = leftover.split("\n");
    leftover = lines.pop();
    for (const line of lines) {
      yield line;
    }
  }
  if (leftover) {
    yield leftover;
  }
}

async function Task4() {
  try {
    for await (const line of readHugeFileLines("text1.txt")) {
      console.log("Line from file:", line);
    }
  } catch (err) {
    console.error("Task 4 error:", err);
  }
}

Task4();
