import chalk from "chalk";
import cliCursor from "cli-cursor";

type LyricLine = {
  text: string;
  time: number;
};

const lyrics: LyricLine[] = [
  { text: "I could eat that girl for lunch", time: 0 },
  { text: "She dances on my tongue", time: 3.8 },
  { text: "I know it's just a hunch", time: 7.1 },
  { text: "But she might be the one", time: 10.3 },
  { text: "I could", time: 14.9 },
  { text: "Eat that girl for lunch", time: 19 },
  { text: "Yeah, she", time: 22.35 },
  { text: "Tastes like she might be the one", time: 26.3 },
  { text: "I could", time: 30 },
  { text: "I could", time: 32 },
  { text: "Eat that girl for lunch", time: 34.52 },
  { text: "Yeah, she", time: 37.82 },
  { text: "Yeah, she", time: 39.82 },
  { text: "Tastes like she might be the one", time: 42 },
  { text: "....................................", time: 45 },
  { text: ".................................", time: 48 },
];

cliCursor.hide();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function printLineSmooth(text: string, lineNumber: number, speed = 40) {
  let i = 0;
  const clearLine = " ".repeat(50);

  process.stdout.write(`\x1B[${lineNumber + 1};1H`);
  while (i < text.length) {
    i++;
    process.stdout.write(
      `\x1B[${lineNumber + 1};1H` +
        chalk.hex("#ff69b4")(text.slice(0, i)) +
        clearLine.slice(i)
    );
    await sleep(speed);
  }
  process.stdout.write(
    `\x1B[${lineNumber + 1};1H` +
      chalk.hex("#ff69b4")(text) +
      clearLine.slice(text.length)
  );
}

async function runLyrics() {
  const start = Date.now();

  console.clear();
  process.stdout.write("\n".repeat(lyrics.length));

  const promises = lyrics.map(async (lyric, index) => {
    const elapsed = (Date.now() - start) / 1000;
    const waitTime = lyric.time - elapsed;

    if (waitTime > 0) {
      await sleep(waitTime * 1000);
    }

    await printLineSmooth(lyric.text, index);
  });

  await Promise.all(promises);

  process.stdout.write(`\x1B[${lyrics.length + 1};1H`);
}
process.on("SIGINT", () => {
  process.stdout.write(`\x1B[${lyrics.length + 1};1H`);
  cliCursor.show();
  console.log("\nStopped by user (Ctrl+C)");
  process.exit(0);
});

async function main() {
  await runLyrics();
  await new Promise(() => {});
}

main().catch((err) => {
  console.error("Error:", err);
  cliCursor.show();
  process.exit(1);
});
